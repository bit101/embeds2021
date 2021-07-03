const { DragPoint, Random, Context, Anim } = bljs;
const { Panel, Canvas, Knob } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
  points: [],
  numPoints: 1000,
  emitter: {
    x: width / 2,
    y: 0,
  },
  size: 1,
  gravity: 0.01,
  spread: 0.2,
  circles: [],
  numCircles: 3,
  k: 0.01,
  radius: 60,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, width, height);
const context = canvas.context;
Context.extendContext(context);
context.lineWidth = 0.05;

new Knob(panel, 30, 40, "Count", model.numPoints, 1, 1000)
  .bind(model, "numPoints");

new Knob(panel, 90, 40, "Size", model.size, 0.1, 5)
  .bind(model, "size")
  .setDecimals(1);

new Knob(panel, 30, 140, "Spread", model.spread, 0, 1)
  .bind(model, "spread")
  .setDecimals(2);

new Knob(panel, 90, 140, "Gravity", model.gravity, 0.001, 0.1)
  .bind(model, "gravity")
  .setDecimals(3);

new Knob(panel, 30, 240, "Force", model.k * 100, 0, 10, event => model.k = event.detail / 1000)
  .setDecimals(1);

new Knob(panel, 90, 240, "Radius", model.radius, 0, 100)
  .bind(model, "radius")
  .setDecimals(1);

/////////////////////////////
// VIEW
/////////////////////////////

for (let i = 0; i < model.numPoints; i++) {
  model.points.push({
    x: model.emitter.x,
    y: model.emitter.y - Random.float(height),
    vx: Random.float(-model.spread, model.spread),
    vy: Random.float(-model.spread, model.spread),
  });
}

for (let i = 0; i < model.numCircles; i++) {
  const dp = new DragPoint(Random.float(width), Random.float(height / 4, height), i + 1, context, () => {});
  model.circles.push(dp);
}

const anim = new Anim(render);
anim.run();

function render(fps) {
  context.clearWhite();
  for (let i = 0; i < model.numPoints; i++) {
    const p = model.points[i];
    p.vy += model.gravity;
    p.x += p.vx;
    p.y += p.vy;
    checkCircles(p);
    if (p.x < 0 || p.x > width || p.y > height) {
      p.x = model.emitter.x;
      p.y = model.emitter.y;
      p.vx = Random.float(-model.spread, model.spread);
      p.vy = Random.float(-model.spread, model.spread);
    }
    context.fillCircle(p.x, p.y, model.size);
  }
  model.circles.forEach(dp => {
    dp.render(context);
  });
}

function checkCircles(point) {
  model.circles.forEach(circle => {
    const dx = point.x - circle.x;
    const dy = point.y - circle.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < model.radius) {
      const tx = circle.x + dx / dist * model.radius;
      const ty = circle.y + dy / dist * model.radius;
      point.vx += (tx - point.x) * model.k;
      point.vy += (ty - point.y) * model.k;
    }
  });
}
