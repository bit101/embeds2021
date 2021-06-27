const { Context, Anim, Random } = bljs;
const { Button, Toggle, Panel, Canvas, Knob } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
  phase: 0,
  rotationSpeed: 0.01,
  numLoops: 20,
  maxLoops: 100,
  wave: 1,
  height: 1,
  lineWidth: 0.65,
  radius: 20,
  loopRadius: 100,
  inverted: false,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

new Knob(panel, 20, 40, "Count", model.numLoops, 0, model.maxLoops)
  .bind(model, "numLoops");
new Knob(panel, 90, 40, "Speed", model.rotationSpeed, -0.1, 0.1)
  .bind(model, "rotationSpeed")
  .setDecimals(2);

new Knob(panel, 20, 140, "Height", model.height, 0, 2)
  .bind(model, "height")
  .setDecimals(2);
new Knob(panel, 90, 140, "Line Width", model.lineWidth, 0.01, 10)
  .bind(model, "lineWidth")
  .setDecimals(2);

new Knob(panel, 20, 240, "Wave", model.wave, 0, 16)
  .bind(model, "wave");
new Knob(panel, 90, 240, "Circle Size", model.radius, 1, 100)
  .bind(model, "radius");

new Knob(panel, 20, 340, "Size", model.loopRadius, 0, 200)
  .bind(model, "loopRadius");
new Toggle(panel, 85, 340, "Inverted", model.inverted)
  .bind(model, "inverted");

/////////////////////////////
// VIEW
/////////////////////////////

const anim = new Anim(render);
anim.run();

function render(fps) {
  if (model.inverted) {
    context.clearBlack();
    context.strokeStyle = "white";
  } else {
    context.clearWhite();
    context.strokeStyle = "black";
  }
  context.lineWidth = model.lineWidth;
  context.save();
  context.translate(200, 200);

  for (let i = 0; i < model.numLoops; i++) {
    context.save();
    const a = i / model.numLoops * Math.PI * 2;
    context.rotate(Math.cos(a * model.wave) * model.height);
    context.scale(Math.cos(model.phase + a), 1);
    context.beginPath();
    context.circle(model.loopRadius, 0, model.radius);
    context.restore();
    context.stroke();
  }

  context.restore();
  model.phase += model.rotationSpeed;
}
