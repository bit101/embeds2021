const { Context, Random } = bljs;
const { Panel, Canvas, VSlider } = mc2;

/////////////////////////////
// MODEL
/////////////////////////////

const lines = [];
const targets = [];
for (let i = 0; i < 14; i++) {
  const x0 = 0;
  const y0 = 0;
  const x1 = 0;
  const y1 = 0;
  lines.push({x0, y0, x1, y1, vx0: 0, vy0: 0, vx1: 0, vy1: 0});
  targets.push({x0, y0, x1, y1});
}

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 780, 640);
const canvas = new Canvas(panel, 160, 20, 600, 600);
const context = canvas.context;
Context.extendContext(context);
const depthSlider = new VSlider(panel, 50, 40, "Iterations", 6, 1, 14);
const shakeSlider = new VSlider(panel, 100, 40, "Shake", 1, 0, 10);
const springSlider = new VSlider(panel, 50, 240, "Spring", 0.05, 0.01, 0.5)
  .setDecimals(2);
const dampSlider = new VSlider(panel, 100, 240, "Damp", 0.93, 0.8, 1.0)
  .setDecimals(2);

/////////////////////////////
// VIEW
/////////////////////////////

canvas.canvas.addEventListener("mousemove", onMouseMove);
context.lineWidth = 0.5;

render();

function render() {
  context.clearWhite();
  context.beginPath();
  const k = springSlider.value;
  const damp = dampSlider.value;
  for (let i = 0; i < depthSlider.value; i++) {
    const line = lines[i];
    const target = targets[i];
    line.vx0 += (target.x0 - line.x0) * k;
    line.vy0 += (target.y0 - line.y0) * k;
    line.vx1 += (target.x1 - line.x1) * k;
    line.vy1 += (target.y1 - line.y1) * k;
    line.x0 += line.vx0;
    line.y0 += line.vy0;
    line.x1 += line.vx1;
    line.y1 += line.vy1;
    line.vx0 *= damp;
    line.vy0 *= damp;
    line.vx1 *= damp;
    line.vy1 *= damp;
    context.moveTo(line.x0, line.y0);
    context.lineTo(line.x1, line.y1);
  }
  context.stroke();
  requestAnimationFrame(render);
}

function onMouseMove(event) {
  const s = shakeSlider.value;
  lines.forEach(line => {
    line.vx0 += Random.float(-s, s);
    line.vy0 += Random.float(-s, s);
    line.vx1 += Random.float(-s, s);
    line.vy1 += Random.float(-s, s);
  });
  const x = event.clientX - canvas.canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.canvas.getBoundingClientRect().top;
  subdiv(context, x, y, 0, 0, 600, 600, depthSlider.value - 1);
}

function subdiv(context, x, y, rx, ry, rw, rh, depth) {
  if (depth < 0) {
    return;
  }
  if (depth % 2 === 0) {
    targets[depth] = {
      x0: rx + rw / 2,
      y0: ry,
      x1: rx + rw / 2,
      y1: ry + rh,
    };
    if (x < rx + rw / 2) {
      subdiv(context, x, y, rx, ry, rw / 2, rh, depth - 1);
    } else {
      subdiv(context, x, y, rx + rw / 2, ry, rw / 2, rh, depth - 1);
    }
  } else {
    targets[depth] = {
      x0: rx,
      y0: ry + rh / 2,
      x1: rx + rw,
      y1: ry + rh / 2,
    };
    if (y < ry + rh / 2) {
      subdiv(context, x, y, rx, ry, rw, rh / 2, depth - 1);
    } else {
      subdiv(context, x, y, rx, ry + rh / 2, rw, rh / 2, depth - 1);
    }
  }
}
