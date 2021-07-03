const { Context, Num } = bljs;
const { Knob, NumericStepper, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
  radius: 180,
  sides: 3,
  count: 20,
  subSides: 4,
  rotation: 0,
  subRotation: 0,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

new NumericStepper(panel, 20, 40, "Sides", model.sides, 3, 20)
  .bind(model, "sides")
  .addHandler(render);

new NumericStepper(panel, 20, 80, "Count", model.count, 1, 100)
  .bind(model, "count")
  .addHandler(render);

new NumericStepper(panel, 20, 120, "Sub Sides", model.subSides, 3, 6)
  .bind(model, "subSides")
  .addHandler(render);

new Knob(panel, 20, 200, "Rotation", model.rotation, 0, Math.PI * 2)
  .bind(model, "rotation")
  .setDecimals(2)
  .addHandler(render);

new Knob(panel, 90, 200, "Sub Rotation", model.subRotation, 0, Math.PI * 2)
  .bind(model, "subRotation")
  .setDecimals(2)
  .addHandler(render);

/////////////////////////////
// VIEW
/////////////////////////////

render();

function render() {
  context.clearWhite();
  context.save();
  context.translate(200, 200);
  context.rotate(model.rotation);

  for (let i = 0; i < model.sides; i++) {
    const angle0 = i / model.sides * Math.PI * 2;
    const x0 = Math.cos(angle0) * model.radius;
    const y0 = Math.sin(angle0) * model.radius;
    const angle1 = (i + 1) / model.sides * Math.PI * 2;
    const x1 = Math.cos(angle1) * model.radius;
    const y1 = Math.sin(angle1) * model.radius;
    const length = Num.dist(x0, y0, x1, y1);
    const radius = length / (model.count * 2);
    const angle = Math.atan2(y1 - y0, x1 - x0);

    for (let j = 0; j < model.count; j++) {
      const t = j / model.count;
      const x = Num.lerp(x0, x1, t);
      const y = Num.lerp(y0, y1, t);
      drawSub(x, y, radius, angle);
    }
  }

  context.restore();
}

function drawSub(x, y, radius, angle) {
  context.save();
  context.translate(x, y);
  context.rotate(angle + model.subRotation);
  context.beginPath();
  for (let i = 0; i < model.subSides; i++) {
    const angle = i / model.subSides * Math.PI * 2;
    context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  context.closePath();
  context.stroke();
  context.restore();
}
