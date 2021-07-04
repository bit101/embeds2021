const { Context, Num } = bljs;
const { Knob, NumericStepper, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 600;
const height = 600;
const model = {
  radius: 280,
  sides: 3,
  rotation: 0,
  points: [],
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 780, 640);
const canvas = new Canvas(panel, 160, 20, width, height);
const context = canvas.context;
Context.extendContext(context);

new NumericStepper(panel, 20, 40, "Sides", model.sides, 3, 20)
  .bind(model, "sides")
  .addHandler(render);

new Knob(panel, 20, 100, "Radius", model.radius, 10, 300)
  .bind(model, "radius")
  .addHandler(render);

new Knob(panel, 90, 100, "Rotation", model.rotation, 0, Math.PI * 2)
  .bind(model, "rotation")
  .setDecimals(2)
  .addHandler(render);

/////////////////////////////
// VIEW
/////////////////////////////

function render() {
  console.log(model.drawing);
  context.clearWhite();
  if (model.drawing) {
    context.strokePath(model.points);
    return;
  }
  if (model.points.length === 0) {
    return;
  }
  const x = model.points[0].x;
  const y = model.points[0].y;
  model.points.forEach(p => {
    p.x -= x;
    p.y -= y;
  });

  context.save();
  context.translate(width / 2, height / 2);
  context.rotate(model.rotation);

  for (let i = 0; i < model.sides; i++) {
    const angle0 = i / model.sides * Math.PI * 2;
    const x0 = Math.cos(angle0) * model.radius;
    const y0 = Math.sin(angle0) * model.radius;
    const angle1 = (i + 1) / model.sides * Math.PI * 2;
    const x1 = Math.cos(angle1) * model.radius;
    const y1 = Math.sin(angle1) * model.radius;
    drawShape(x0, y0, x1, y1);
  }
  context.restore();
}

function drawShape(x0, y0, x1, y1) {
  const length = Num.dist(x0, y0, x1, y1);
  const angle = Math.atan2(y1 - y0, x1 - x0);
  const p0 = model.points[0];
  const p1 = model.points[model.points.length - 1];
  const shapeLength = Num.dist(p0.x, p0.y, p1.x, p1.y);
  const shapeAngle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  const scale = length / shapeLength;

  context.save();
  context.translate(x0, y0);
  context.rotate(angle - shapeAngle);
  context.scale(scale, scale);
  context.beginPath();
  context.path(model.points);
  context.restore();
  context.stroke();
}

canvas.addEventListener("mousedown", onMouseDown);

function onMouseDown(event) {
  model.points = [];
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;
  model.points.push({x, y});
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  model.drawing = true;
}

function onMouseMove(event) {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;
  model.points.push({x, y});
  render();
}

function onMouseUp(event) {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  model.drawing = false;
  render();
}
