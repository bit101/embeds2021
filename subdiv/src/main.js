const { Context } = bljs;
const { Panel, Canvas, VSlider } = mc2;

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
const depthSlider = new VSlider(panel, 60, 40, "Iterations", 6, 1, 12);

// other controls here

/////////////////////////////
// VIEW
/////////////////////////////

canvas.canvas.addEventListener("mousemove", onMouseMove);
context.lineWidth = 0.5;

function onMouseMove(event) {
  context.clearWhite();
  const x = event.clientX - canvas.canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.canvas.getBoundingClientRect().top;
  subdiv(context, x, y, 0, 0, 400, 400, depthSlider.value - 1);
}

function subdiv(context, x, y, rx, ry, rw, rh, depth) {
  if (depth < 0) {
    context.fillRect(rx, ry, rw, rh);
    return;
  }
  if (depth % 2 === 0) {
    context.beginPath();
    context.moveTo(rx + rw / 2, ry);
    context.lineTo(rx + rw / 2, ry + rh);
    context.stroke();
    if (x < rx + rw / 2) {
      subdiv(context, x, y, rx, ry, rw / 2, rh, depth - 1);
    } else {
      subdiv(context, x, y, rx + rw / 2, ry, rw / 2, rh, depth - 1);
    }
  } else {
    context.beginPath();
    context.moveTo(rx, ry + rh / 2);
    context.lineTo(rx + rw, ry + rh / 2);
    context.stroke();
    if (y < ry + rh / 2) {
      subdiv(context, x, y, rx, ry, rw, rh / 2, depth - 1);
    } else {
      subdiv(context, x, y, rx, ry + rh / 2, rw, rh / 2, depth - 1);
    }
  }
}
