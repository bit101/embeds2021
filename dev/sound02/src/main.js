const { TextBox, Window, Knob, PlayButton, Toggle, Canvas } = mc2;

const context = new AudioContext();

// const lfo = new OscNode(document.body, context, 1) 
//   .setMinMaxValue(0, 20, 1)
//   .setTitle("LFO")
//   .move(20, 20);

// const lfoGain = new GainNode(document.body, context)
//   .setMinMaxValue(0, 500, 100)
//   .setTitle("LFO Gain")
//   .move(140, 20);

const mainOsc = new OscNode(document.body, context, 440) 
  .setTitle("Main Osc")
  .move(260, 20);

const volume = new GainNode(document.body, context, 0.5)
  .setTitle("Volume")
  .move(380, 20);

const dest = new DestNode(document.body, context)
  .setTitle("Output")
  .move(500, 20);

// lfo.setOutput(lfoGain);
// lfoGain.setOutput(mainOsc);
mainOsc.connect(volume);
volume.connect(dest);


/*
const lfoWin = new Window(document.body, "LFO", 20, 20, 100, 275)
  .setDraggable(false)
  .setMinimizable(false);
new Knob(lfoWin, 30, 30, "Frequency", model.lfoFrequency, 0, 20, onLFOFrequency)
  .setDecimals(1);
new Knob(lfoWin, 30, 120, "Gain", model.lfoGain, 0, 400, onLFOGain);
new PlayButton(lfoWin, 30, 200, false, onLFOPlay);


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

const lfoGain = audio.createGain();
lfoGain.gain.value = 0;

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
*/
