const { Context } = bljs;
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
  lines.push({x0, y0, x1, y1});
  targets.push({x0, y0, x1, y1});
}

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 780, 640);
const canvas = new Canvas(panel, 160, 20, 600, 600);
const context = canvas.context;
Context.extendContext(context);
const depthSlider = new VSlider(panel, 60, 40, "Iterations", 6, 1, 14);

/////////////////////////////
// VIEW
/////////////////////////////

canvas.canvas.addEventListener("mousemove", onMouseMove);
context.lineWidth = 0.5;

render();

function render() {
  context.clearWhite();
  context.beginPath();
  for (let i = 0; i < depthSlider.value; i++) {
    const line = lines[i];
    const target = targets[i];
    line.x0 += (target.x0 - line.x0) * 0.09;
    line.y0 += (target.y0 - line.y0) * 0.1;
    line.x1 += (target.x1 - line.x1) * 0.06;
    line.y1 += (target.y1 - line.y1) * 0.07;
    context.moveTo(line.x0, line.y0);
    context.lineTo(line.x1, line.y1);
  }
  context.stroke();
  requestAnimationFrame(render);
}

function onMouseMove(event) {
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
