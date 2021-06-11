const { TextBox, Window, Knob, PlayButton, Toggle, Canvas } = mc2;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
  lfoFrequency: 1,
  lfoGain: 100,
  lfoType: "sine",
  gain: 0.5,
  frequency: 440,
  type: "sine", // sawtooth, square, triangle
};

/////////////////////////////
// CONTROLS
/////////////////////////////
// const panel = new Panel(document.body);
const lfoWin = new Window(document.body, "LFO", 20, 20, 100, 275)
  .setDraggable(false)
  .setMinimizable(false);
new Knob(lfoWin, 30, 30, "Frequency", model.lfoFrequency, 0, 20, onLFOFrequency)
  .setDecimals(1);
new Knob(lfoWin, 30, 120, "Gain", model.lfoGain, 0, 400, onLFOGain);
new PlayButton(lfoWin, 30, 200, false, onLFOPlay);

const oscWin = new Window(document.body, "Oscillator", 140, 20, 100, 190)
  .setDraggable(false)
  .setMinimizable(false);
new Knob(oscWin, 30, 30, "Frequency", model.frequency, 0, 2000, onFrequency);
new PlayButton(oscWin, 30, 115, false, onPlay);

const gainWin = new Window(document.body, "Gain", 260, 20, 100, 190)
  .setDraggable(false)
  .setMinimizable(false);
new Knob(gainWin, 30, 30, "Gain", model.gain, 0, 1, onGain)
  .setDecimals(2);
new Toggle(gainWin, 25, 115, "Connected", true, onConnect);

const destWin = new Window(document.body, "Destination", 380, 20, 100, 100)
  .setDraggable(false)
  .setMinimizable(false);
new Toggle(destWin, 25, 30, "Active", true, onActive);

const analyserWin = new Window(document.body, "Analyzer", 380, 140, 300, 210)
  .setDraggable(false)
  .setMinimizable(false);
const canvas = new Canvas(analyserWin, 0, 0, 300, 180);
const context = canvas.context;

const textWin = new Window(document.body, "Info", 140, 230, 220, 120)
  .setDraggable(false)
  .setMinimizable(false);
new TextBox(textWin, 10, 10, "First, start the Oscillator. Then the LFO (Low Frequency Oscillator). Then play around.")
  .setWidth(210);

function onPlay(event) {
  if (event.detail) {
    createOsc();
  } else {
    osc.stop();
  }
}

function onFrequency(event) {
  model.frequency = event.detail;
  if (osc) {
    osc.frequency.value = model.frequency;
  }
}

function onGain(event) {
  model.gain = event.detail;
  if (gain) {
    gain.gain.value = model.gain;
  }
}

function onConnect(event) {
  if (event.detail) {
    gain.connect(audio.destination);
  } else {
    gain.disconnect(audio.destination);
  }
}

function onActive(event) {
  if (event.detail) {
    audio.resume();
  } else {
    audio.suspend();
  }
}

function onLFOPlay(event) {
  if (event.detail) {
    createLFO();
  } else if (lfo) {
    lfo.stop();
    osc.frequency.value = model.frequency;
  }
}

function onLFOFrequency(event) {
  model.lfoFrequency = event.detail;
  if (lfo) {
    lfo.frequency.value = model.lfoFrequency;
  }
}

function onLFOGain(event) {
  model.lfoGain = event.detail;
  if (osc) {
    lfoGain.gain.value = model.lfoGain;
  }
}

/////////////////////////////
// VIEW
/////////////////////////////

let osc, lfo;
const audio = new AudioContext();

const gain = audio.createGain();
gain.gain.value = model.gain;
gain.connect(audio.destination);

const lfoGain = audio.createGain();
lfoGain.gain.value = 0;

function createOsc() {
  osc = audio.createOscillator();
  osc.frequency.value = model.frequency;
  osc.connect(gain);
  osc.type = model.type;
  lfoGain.connect(osc.frequency);
  osc.start();
}

function createLFO() {
  if (osc) {
    lfo = audio.createOscillator();
    lfo.frequency.value = model.lfoFrequency;
    lfo.connect(lfoGain);
    lfoGain.gain.value = model.lfoGain;
    lfoGain.connect(osc.frequency);
    lfo.type = model.lfoType;
    lfo.start();
  }
}

const analyser = audio.createAnalyser();
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);
gain.connect(analyser);
analyser.fftSize = 2048;

draw();

function draw() {
  const w = context.canvas.width;
  const h = context.canvas.height;

  context.clearRect(0, 0, w, h);
  analyser.getByteTimeDomainData(dataArray);
  context.beginPath();

  const sliceWidth = w / bufferLength;
  let x = 0;

  context.beginPath();
  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * h / 2;

    context.lineTo(x, y);

    x += sliceWidth;
  }

  context.lineTo(canvas.width, canvas.height / 2);
  context.stroke();
  requestAnimationFrame(draw);
}
