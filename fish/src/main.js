const { Random, Context, FPS } = bljs;
const { Panel, Canvas, Knob, VBox, TextBox } = mc;

const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);

const leftBox = new VBox(panel, 20, 40, 45);
const speedKnob = new Knob(leftBox, 0, 0, "Speed", 20, -50, 50);
const waveKnob = new Knob(leftBox, 0, 0, "Wave", 4, 0, 24);
const wanderKnob = new Knob(leftBox, 0, 0, "Wander", 1, 0, 5);
wanderKnob.decimals = 2;
const scaleKnob = new Knob(leftBox, 0, 0, "Scale", 1, 0.01, 10);
scaleKnob.decimals = 2;

const rightBox = new VBox(panel, 90, 40, 45);
const lengthKnob = new Knob(rightBox, 0, 0, "Length", 300, 0, 5000);
const waveHeightKnob = new Knob(rightBox, 0, 0, "Wave Height", 10, 0, 70);
const widthKnob = new Knob(rightBox, 0, 0, "Line Width", 1, 0.01, 10);
widthKnob.decimals = 2;
const rotateKnob = new Knob(rightBox, 0, 0, "Rotation", 0, -180, 180);

new TextBox(panel, 20, 370, "A couple of mirrored Lissajous curves, abused beyond recognition").width = 120;

const context = canvas.context;
Context.extendContext(context);

context.strokeStyle = "#fff";

let xangle = 0;
let yangle = 0;
phase = Random.float(10);

const fps = new FPS(panel, 160, 425);
fps.start();
render();

function render() {
  Random.seed(0);
  const points = [];
  context.clearBlack();
  context.save();
  context.translate(200, 200);
  context.scale(scaleKnob.value, scaleKnob.value);
  context.rotate(Math.PI / 4 + rotateKnob.value * Math.PI / 180);
  context.lineWidth = widthKnob.value;
  context.lineJoin = "round";

  let xvel = Math.sin(phase) * 0.05;
  let yvel = Math.sin(phase * 1.357 + 2) * 0.05;
  const wh = waveHeightKnob.value;
  const wander = wanderKnob.value / 100;
  for (let i = 0; i < lengthKnob.value; i++) {
    xradius = Math.sin(xangle * Math.PI * waveKnob.value) * wh + 140 - wh;
    yradius = Math.sin(yangle * Math.PI * waveKnob.value) * wh + 140 - wh;
    const x = Math.cos(xangle) * xradius;
    const y = Math.sin(yangle) * yradius;
    points.push({x, y});
    xangle += xvel;
    yangle += yvel;
    xvel += Random.float(-wander, wander);
    yvel += Random.float(-wander, wander);
  }
  context.beginPath();
  points.forEach(p => context.lineTo(p.x, p.y));
  context.stroke();
  context.beginPath();
  points.forEach(p => context.lineTo(p.y, p.x));
  context.stroke();
  context.restore();
  xangle = phase * 10;
  yangle = phase * 10;
  phase += speedKnob.value / 50000;
  requestAnimationFrame(render);

  fps.logFrame();
}
