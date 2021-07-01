const { DragPoint, Random, Context, Anim } = bljs;
const { Panel, Canvas } = mc;

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
  gravity: 0.01,
  spread: 0.2,
  circles: [],
  numCircles: 3,
  k: 0.01,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, width, height);
const context = canvas.context;
Context.extendContext(context);
context.lineWidth = 0.05;

// other controls here

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
  dp.radius = 60;
  model.circles.push(dp);
}

const anim = new Anim(render);
anim.run();

function render(fps) {
  context.clearWhite();
  model.points.forEach(p => {
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
  });
  model.circles.forEach(dp => {
    dp.render(context);
    context.strokeCircle(dp.x, dp.y, dp.radius);
  });
  context.points(model.points, 1);
}

function checkCircles(point) {
  model.circles.forEach(circle => {
    const dx = point.x - circle.x;
    const dy = point.y - circle.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < circle.radius) {
      const tx = circle.x + dx / dist * circle.radius;
      const ty = circle.y + dy / dist * circle.radius;
      point.vx += (tx - point.x) * model.k;
      point.vy += (ty - point.y) * model.k;
    }
  });
}
