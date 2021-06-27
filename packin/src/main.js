const { Noise, Context, Anim, Random, Num } = bljs;
const { Panel, Canvas, Knob, ColorPicker, NumericStepper, PlayButton, Button, Label } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
  scale: 0.01,
  maxPoints: 500,
  points: 0,
  spacing: 0.1,
  innerColor: "#f00",
  outerColor: "#000",
  lineWidth: 0.5,
  legs: 11,
  wander: 0.1,
  seed: Random.int(10000),
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

new Knob(panel, 20, 140, "Points", model.maxPoints, 100, 10000, reset)
  .bind(model, "maxPoints");
new Knob(panel, 100, 140, "Line Width", model.lineWidth, 0.05, 5, reset)
  .bind(model, "lineWidth")
  .setDecimals(2);

new Knob(panel, 20, 240, "Legs", model.legs, 1, 20, reset)
  .bind(model, "legs");
new Knob(panel, 100, 240, "Wander", model.wander, 0.0, 0.5, reset)
  .bind(model, "wander")
  .setDecimals(2);

new NumericStepper(panel, 20, 340, "Seed", model.seed, 0, 10000, reset)
  .bind(model, "seed");

new ColorPicker(panel, 20, 400, "Inner", model.innerColor, reset)
  .bind(model, "innerColor");
new ColorPicker(panel, 20, 440, "Outer", model.outerColor, reset)
  .bind(model, "outerColor");
const bgPicker = new ColorPicker(panel, 20, 480, "Background", "#fff", reset);

const connLabel = new Label(panel, 20, 520, "Connections: 0");
const playButton = new PlayButton(panel, 20, 550, true);
new Button(panel, 80, 550, "Reset", reset)
  .setWidth(60);

/////////////////////////////
// VIEW
/////////////////////////////

const anim = new Anim(render);
anim.run();
playButton.bind(anim, "running");

function render() {
  const p = Random.point(0, 0, 600, 600);
  p.radius = 2;
  const n = Noise.perlin(p.x * model.scale, p.y * model.scale, model.seed);
  if (n > model.spacing) {
    context.strokeStyle = model.innerColor;
    grow(p, model.spacing);
  } else if (n < -model.spacing) {
    context.strokeStyle = model.outerColor;
    grow(p, -model.spacing);
  }
}

function grow(p0, limit) {
  connLabel.text = "Points: " + model.points;
  model.points++;
  if (model.points > model.maxPoints) {
    anim.stop();
    playButton.setPlaying(false);
    playButton.setEnabled(false);
  }
  for (let i = 0; i < model.legs; i++) {
    let x = p0.x;
    let y = p0.y;
    let angle = i / model.legs * Math.PI * 2 + Random.float(-0.1, 0.1);
    context.beginPath();
    context.lineWidth = model.lineWidth;
    context.moveTo(p0.x, p0.y);
    for (let j = 0; j < 500; j++) {
      const dx = Math.cos(angle) * 1;
      const dy = Math.sin(angle) * 1;
      x += dx;
      y += dy;
      context.lineTo(x, y);
      angle += Random.float(-model.wander, model.wander);
      const n = Noise.perlin(x * model.scale, y * model.scale, model.seed);
      if ((limit < 0 && n > limit) || (limit > 0 && n < limit)) {
        context.stroke();
        break;
      }
    }
  }
}

function reset() {
  model.points = 0;
  context.clearRGB(bgPicker.red, bgPicker.green, bgPicker.blue);
  playButton.setEnabled(true);
}
