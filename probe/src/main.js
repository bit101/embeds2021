const { Noise, Context, Anim, Random, Num } = bljs;
const { Panel, Canvas, Knob, ColorPicker, Checkbox, NumericStepper, PlayButton, Button, Label } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
  scale: 0.01,
  spacing: 0.1,
  innerColor: "#f00",
  outerColor: "#000",
  pColor: "#000",
  lineWidth: 0.1,
  pSize: 1,
  wander: 0,
  count: 0,
  maxCount: 100,
  seed: Random.int(10000),
  p: null,
  doReset: true,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 780, 640);
const canvas = new Canvas(panel, 160, 20, 600, 600);
const context = canvas.context;
Context.extendContext(context);

new Knob(panel, 20, 40, "Noise Scale", model.scale, 0.001, 0.1, reset)
  .bind(model, "scale")
  .setDecimals(3);
new Knob(panel, 100, 40, "Spacing", model.spacing, 0.01, 0.5, reset)
  .bind(model, "spacing")
  .setDecimals(2);

new Knob(panel, 20, 130, "Bounces", model.maxCount, 1, 1000, reset)
  .bind(model, "maxCount");
new Knob(panel, 100, 130, "Line Width", model.lineWidth, 0.05, 5, reset)
  .bind(model, "lineWidth")
  .setDecimals(2);

new Knob(panel, 20, 220, "Point Size", model.pSize, 0, 4, reset)
  .bind(model, "pSize")
  .setDecimals(1);
new Knob(panel, 100, 220, "Wander", model.wander, 0.0, 0.5, reset)
  .bind(model, "wander")
  .setDecimals(2);

new NumericStepper(panel, 20, 310, "Seed", model.seed, 0, 10000, reset)
  .bind(model, "seed");

new ColorPicker(panel, 20, 360, "Inner", model.innerColor, reset)
  .bind(model, "innerColor");
new ColorPicker(panel, 20, 400, "Outer", model.outerColor, reset)
  .bind(model, "outerColor");
new ColorPicker(panel, 20, 440, "Point", "#000", reset)
  .bind(model, "pColor");
const bgPicker = new ColorPicker(panel, 20, 480, "Background", "#fff", reset)
  .setSliderPosition("top");

const connLabel = new Label(panel, 20, 520, "Connections: 0");
const playButton = new PlayButton(panel, 20, 550, true);
new Button(panel, 80, 550, "Reset", () => reset(true))
  .setWidth(60);

new Checkbox(panel, 20, 590, "Reset on changes", true)
  .bind(model, "doReset");

/////////////////////////////
// VIEW
/////////////////////////////

makePoint();
const anim = new Anim(render);
anim.run();
playButton.bind(anim, "running");

function render() {
  context.lineWidth = model.lineWidth;
  context.fillStyle = model.pColor;
  let n, vx, vy;
  do {
    context.beginPath();
    context.moveTo(model.p.x, model.p.y);
    vx = Math.cos(model.p.angle) * 1;
    vy = Math.sin(model.p.angle) * 1;
    model.p.angle += Random.float(-model.wander, model.wander);
    model.p.x += vx;
    model.p.y += vy;
    context.lineTo(model.p.x, model.p.y);
    context.stroke();
    n = Noise.perlin(model.p.x * model.scale, model.p.y * model.scale, model.seed);
  } while (checkThreshold(n) && model.p.x >= 0 && model.p.x <= 600 && model.p.y >= 0 && model.p.y <= 600);
  context.fillCircle(model.p.x, model.p.y, model.pSize);
  model.p.x -= vx;
  model.p.y -= vy;
  model.p.angle = Random.float(Math.PI * 2);
  model.count++;
  connLabel.text = "Bounces: " + model.count;
  if (model.count > model.maxCount) {
    model.count = 0;
    makePoint();
  }
}

function checkThreshold(n) {
  if (model.threshold < 0) {
    return n < model.threshold;
  } else {
    return n > model.threshold;
  }
}


function makePoint() {
  model.p = Random.point(0, 0, 600, 600);
  let n = Noise.perlin(model.p.x * model.scale, model.p.y * model.scale, model.seed);
  while (n < model.spacing && n > -model.spacing) {
    model.p = Random.point(0, 0, 600, 600);
    n = Noise.perlin(model.p.x * model.scale, model.p.y * model.scale, model.seed);
  }

  if (n < 0) {
    context.strokeStyle = model.innerColor;
    model.threshold = -model.spacing;
  } else {
    context.strokeStyle = model.outerColor;
    model.threshold = model.spacing;
  }
  model.p.angle = Random.float(Math.PI * 2);
}

function reset(resetParam) {
  if (resetParam === true || model.doReset) {
    model.points = 0;
    context.clearRGB(bgPicker.red, bgPicker.green, bgPicker.blue);
  }
}

