const { Context, FPS } = bljs;
const { Button, Panel, Canvas, Knob, Checkbox, TextBox } = mc2;

const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);

const model = {
  grav: 1000,
  repel: 20,
  grid: true,
  centers: false,
  line: true,
  points: false,
  max: 5,
  gridSize: 50,
  showVisited: false,
};

new Knob(panel, 20, 50, "Square Grav", model.grav, 0, 10000)
  .bind(model, "grav");
new Knob(panel, 90, 50, "Point Repel", model.repel, 0, 1000)
  .bind(model, "repel");

new Knob(panel, 20, 150, "Max Speed", model.max, 1, 20)
  .bind(model, "max");

new Knob(panel, 90, 150, "Grid Size", model.gridSize, 10, 200)
  .bind(model, "gridSize");

new Checkbox(panel, 20, 240, "Draw Grid", model.grid)
  .bind(model, "grid");

new Checkbox(panel, 20, 270, "Draw Line", model.line)
  .bind(model, "line");

new Checkbox(panel, 20, 300, "Draw Points", model.points)
  .bind(model, "points");

new Checkbox(panel, 20, 330, "Draw Centers", model.centers)
  .bind(model, "centers");

new Checkbox(panel, 20, 360, "Show Visited Cells", model.showVisited)
  .bind(model, "showVisited");

new Button(panel, 20, 390, "Reset", reset);

const context = canvas.context;
Context.extendContext(context);
context.lineWidth = 0.2;
context.grid(0, 0, 400, 400, model.gridSize, model.gridSize);
context.lineWidth = 0.5;

let cells = {};
const point = {
  x: 205,
  y: 205,
  vx: 5,
  vy: 1,
};

const fps = new FPS(panel, 160, 424);
fps.start();

render();

function reset() {
  cells = {};
  point.x = 205;
  point.y = 205;
  point.vx = 8;
  point.vy = 1;
  context.clearWhite();
  if (model.grid) {
    context.lineWidth = 0.2;
    context.grid(0, 0, 400, 400, model.gridSize, model.gridSize);
    context.lineWidth = 0.5;
  }
  if (model.centers) {
    for (let x = model.gridSize / 2; x < 400; x += model.gridSize) {
      for (let y = model.gridSize / 2; y < 400; y += model.gridSize) {
        context.fillCircle(x, y, 1);
      }
    }
  }
}

function render() {
  const x = point.x;
  const y = point.y;
  point.x += point.vx;
  point.y += point.vy;
  let draw = true;
  if (point.x < 0) {
    point.x = 400;
    draw = false;
  } else if (point.x > 400) {
    point.x = 0;
    draw = false;
  }
  if (point.y < 0) {
    point.y = 400;
    draw = false;
  } else if (point.y > 400) {
    point.y = 0;
    draw = false;
  }
  if (draw && model.line) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(point.x, point.y);
    context.stroke();
  }
  if (model.points) {
    context.fillCircle(point.x, point.y, 1);
  }

  const cellX = Math.floor(point.x / model.gridSize);
  const cellY = Math.floor(point.y / model.gridSize);
  const cellName = `${cellX}_${cellY}`;
  if (!cells[cellName]) {
    cells[cellName] = [];
    if (model.showVisited) {
      context.save();
      context.fillStyle = "rgba(255, 0, 0, 0.1)";
      context.fillRect(cellX * model.gridSize, cellY * model.gridSize, model.gridSize, model.gridSize);
      context.restore();
    }
  }
  const cellPoints = cells[cellName];

  const cx = cellX * model.gridSize + model.gridSize / 2;
  const cy = cellY * model.gridSize + model.gridSize / 2;
  attract(point, cx, cy, model.grav);
  cellPoints.forEach(p => attract(point, p.x, p.y, -model.repel));

  point.vx *= 0.95;
  point.vy *= 0.95;
  const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
  if (speed > model.max) {
    point.vx *= model.max / speed;
    point.vy *= model.max / speed;
  }

  cellPoints.push({x: point.x, y: point.y});

  // setTimeout(render, 1000);
  requestAnimationFrame(render);
  fps.logFrame();
}

function attract(point, x, y, grav) {
  const dx = x - point.x;
  const dy = y - point.y;
  const dsq = dx * dx + dy * dy;
  const dist = Math.sqrt(dsq);
  const force = grav / dsq;
  const ax = dx / dist * force;
  const ay = dy / dist * force;
  point.vx += ax;
  point.vy += ay;
}
