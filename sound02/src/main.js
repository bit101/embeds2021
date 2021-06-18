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
