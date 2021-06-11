const { Num, Random, Context, FPS } = bljs;
const { Panel, Canvas } = mc2;

/////////////////////////////
// MODEL
/////////////////////////////

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

// other controls here

const fps = new FPS(panel, 160, 425);
fps.start();

/////////////////////////////
// VIEW
/////////////////////////////

const num = 20;
const points = [];

init();
render();

function init() {
  context.lineWidth = 0.2;
  for (let i = 0; i < num; i++) {
    points.push(Random.point(100, 100, 200, 200));
  }
}

function render() {
  context.clearWhite();

  context.points(points, 2);
  let start = findFirst(points);
  context.strokeCircle(start.x, start.y, 10);
  let set = closestK(start);
  let next = findNext(set, start);
  remove(next, points);
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(next.x, next.y);
  context.stroke();

  for (let i = 0; i < 10; i++) {
    start = next;
    set = closestK(start);
    next = findNext(set, start);
    remove(next, points);
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(next.x, next.y);
    context.stroke();
  }

  // context.strokeStyle = "red";
  // context.strokeCircle(next.x, next.y, 10);

  // requestAnimationFrame(render);
  // fps.logFrame();
}


function findFirst(points) {
  let left = Number.MAX_VALUE;
  let point;
  points.forEach(p => {
    if (p.x < left) {
      left = p.x;
      point = p;
    }
  });
  return point;
}

function closestK(point) {
  const arr = points.map(p => p);
  arr.sort((a, b) => Num.dist(a, point) - Num.dist(b, point));
  arr.shift();
  arr.length = 5;
  return arr;
}

function findNext(set, start) {
  let lowestBearing = 10000;
  let lowestIndex;
  const bearing = Math.PI;
  for (let i = 0; i < set.length; i++) {
    let p = set[i];
    let b = Math.atan2(p.y - start.y, p.x - start.x) - bearing;
    if (b < lowestBearing) {
      lowestBearing = b;
      lowestIndex = i;
    }
  }
  return set[lowestIndex];
}

function remove(next, points) {
  const index = points.indexOf(next);
  points.splice(index, 1);
}
