const { Random, Context, FPS } = bljs;
const { Panel, Canvas, VSlider, Button, TextBox } = mc;

/////////////////////////////
// MODEL
/////////////////////////////
const model = {
  gravity: 65,
  maxSpeed: 6,
  damp: 0.995,
  num: 50,
  size: 1,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

new VSlider(panel, 20, 40, "Gravity", model.gravity, 0, 100)
  .rotateDeg(5)
  .bind(model, "gravity");

new VSlider(panel, 70, 35, "Max Vel", model.maxSpeed, 1, 20)
  .rotateDeg(-3)
  .bind(model, "maxSpeed");

new VSlider(panel, 120, 40, "Damp", model.damp, 0.9, 1)
  .rotateDeg(2)
  .setDecimals(3)
  .bind(model, "damp");

new VSlider(panel, 20, 250, "Count", model.num, 3, 500)
  .rotateDeg(-5)
  .bind(model, "num");

new VSlider(panel, 70, 250, "Size", model.size, 0.5, 10)
  .rotateDeg(3)
  .setDecimals(1)
  .bind(model, "size");

new Button(panel, 75, 320, "Reset", init)
  .rotateDeg(-60);

const fps = new FPS(panel, 160, 425);
fps.start();

/////////////////////////////
// VIEW
/////////////////////////////

const points = [];

init();
render();

function init() {
  points.length = 0;
  for (let i = 0; i < 500; i++) {
    points.push({
      x: Random.float(10, 20),
      y: Random.float(10, 20),
      vx: Random.float(-1, 1),
      vy: Random.float(-1, 1),
    });
  }
}

function render() {
  context.clearWhite();

  for (let i = 0; i < model.num; i++) {
    // I really just need to make a reusable particle class
    const p = points[i];
    const dx = 200 - p.x;
    const dy = 200 - p.y;
    const dsq = dx * dx + dy * dy;
    const dist = Math.sqrt(dsq);
    p.vx += model.gravity / dsq * dx / dist;
    p.vy += model.gravity / dsq * dy / dist;
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed > model.maxSpeed) {
      p.vx *= model.maxSpeed / speed;
      p.vy *= model.maxSpeed / speed;
    }
    p.vx *= model.damp;
    p.vy *= model.damp;
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) {
      p.x = 0;
      p.vx *= -1;
    } else if (p.x > 400) {
      p.x = 400;
      p.vx *= -1;
    }
    if (p.y < 0) {
      p.y = 0;
      p.vy *= -1;
    } else if (p.y > 400) {
      p.y = 400;
      p.vy *= -1;
    }
    context.fillStyle = "black";
    context.fillCircle(p.x, p.y, model.size);
  }
  context.fillCircle(200, 200, 4);

  const hull = convexHull(points);
  context.fillStyle = "rgba(0, 0, 0, 0.09)";
  context.fillPath(hull);
  requestAnimationFrame(render);
  fps.logFrame();
}

function convexHull(list) {
  const hull = [];
  let start = startPoint(list);
  let end;
  do {
    hull.push(start);
    end = list[0];
    for (let i = 1; i < model.num; i++) {
      const point = list[i];
      if (end === start || orientation(start, point, end) === 1) {
        end = point;
      }
    }
    start = end;
  } while (end !== hull[0]);
  return hull;
}

function orientation(p, q, r) {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) {
    return 0; // colinear
  }
  if (val > 0) {
    return 1; // clockwise
  }
  return 2; // counterclockwise
}

function startPoint(list) {
  let min = Number.MAX_VALUE;
  let point;
  for (let i = 0; i < model.num; i++) {
    const p = list[i];
    if (p.x < min) {
      min = p.x;
      point = p;
    }
  }
  return point;
}
