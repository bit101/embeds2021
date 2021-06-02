const { Random, Context, FPS } = bljs;
const { Panel, Canvas, Knob, VBox, TextBox } = mc2;


const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

// Random.seed(5);

const points = [];
const num = 1000 ;
for (let i = 0; i < num; i++) {
  points.push({
    x: Random.float(10, 20),
    y: Random.float(10, 20),
    vx: Random.float(-1, 1),
    vy: Random.float(-1, 1),
  });
}
render();
// console.log(pointOnLeft(
//   {x: 100, y: 200},
//   {x: 50, y: 150},
//   {x: 150, y: 150},
//  ));

function render() {
  context.clearWhite();
  context.fillStyle = "black";
  context.fillCircle(200, 200, 4);

  points.forEach(p => {
    const dx = 200 - p.x;
    const dy = 200 - p.y;
    const dsq = dx * dx + dy * dy;
    const dist = Math.sqrt(dsq);
    p.vx += 50 / dsq * dx / dist;
    p.vy += 50 / dsq * dy / dist;
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    const max = 6;
    if (speed > max) {
      p.vx *= max / speed;
      p.vy *= max / speed;
    }
    p.vx *= 0.995;
    p.vy *= 0.995;
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
  });
  context.fillStyle = "black";
  context.points(points, 1);

  const hull = convexHull(points);
  context.fillStyle = "rgba(0, 0, 0, 0.05)";
  context.fillPath(hull);
  requestAnimationFrame(render);
}

function convexHull(points) {
  let hull = [];
  let p0 = startPoint(points);
  let p1;
  let i = 0;
  do {
    hull[i] = p0;
    p1 = points[0];
    for (let j = 0; j < points.length; j++) {
      if (p1 === p0 || pointOnLeft(points[j], hull[i], p1)) {
        p1 = points[j];
      }
    }
    i++;
    p0 = p1;
  } while (p1 !== hull[0]); 
  return hull;
}

function pointOnLeft(p0, p1, p2) {
  if (p0 === p1 || p0 === p2) {
    return false;
  }
  const lineAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const pointAngle = Math.atan2(p0.y - p1.y, p0.x - p1.x);
  const diff = lineAngle - pointAngle;
  const result =  (diff > 0 && diff < Math.PI) || (diff < -Math.PI);
  return result;
}

function startPoint(points) {
  let min = Number.MAX_VALUE;
  let point;
  points.forEach(p => {
    if (p.x < min) {
      min = p.x;
      point = p;
    }
  });
  return point;
}
