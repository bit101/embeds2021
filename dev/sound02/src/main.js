const { Dropdown, TextBox, Window, Knob, PlayButton, Toggle, Canvas } = mc2;

const context = new AudioContext();

const lfo = new OscNode(document.body, context, 1)
  .setMinMaxValue(0, 100, 1)
  .setTitle("LFO")
  .move(20, 20);

const lfoGain = new GainNode(document.body, context)
  .setMinMaxValue(0, 1000, 100)
  .setTitle("LFO Gain")
  .move(140, 20);

const mainOsc = new OscNode(document.body, context, 440)
  .setTitle("Main Osc")
  .move(260, 20);

const filter = new FilterNode(document.body, context, 200, "lowpass")
  .setTitle("Filter")
  .move(380, 20);

const volume = new GainNode(document.body, context, 0.5)
  .setTitle("Volume")
  .move(500, 20);

const dest = new DestNode(document.body, context)
  .setTitle("Output")
  .move(620, 20);

const analyser = new AnalyserNode(document.body, context)
  .move(20, 280);

lfo.setTarget(lfoGain);
lfoGain.setTarget(mainOsc);
mainOsc.setTarget(filter);
filter.setTarget(volume);
volume.setTarget(analyser);
analyser.setTarget(dest);

/*
const analyserWin = new Window(document.body, "Analyzer", 380, 140, 300, 210)
  .setDraggable(false)
  .setMinimizable(false);
const canvas = new Canvas(analyserWin, 0, 0, 300, 180);
const context = canvas.context;

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
