const { Context, Random } = bljs;
const { Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

// other controls here

/////////////////////////////
// VIEW
/////////////////////////////

// const anim = new Anim(render);
// anim.run();

render();
function render() {
  const p0 = {
    x: Random.float(400),
    y: Random.float(400),
  };

  const p1 = {
    x: Random.float(400),
    y: Random.float(400),
  };

  context.points([p0, p1], 4);
  fullLine(p0.x, p0.y, p1.x, p1.y);
}

function fullLine(x0, y0, x1, y1) {
  let xA, yA, xB, yB;
  if (x0 === x1) {
    xA = x0;
    yA = 0;
    xB = x0;
    yB = context.canvas.height;
  } else {
    const m = (y1 - y0) / (x1 - x0);
    const b = y0 - m * x0;

    if (m >= -1 && m <= 1) {
      xA = 0;
      yA = m * xA + b;
      xB = context.canvas.height;
      yB = m * xB + b;
    } else {
      yA = 0;
      xA = (yA - b) / m;
      yB = context.canvas.height;
      xB = (yB - b) / m;
    }
  }

  context.beginPath();
  context.moveTo(xA, yA);
  context.lineTo(xB, yB);
  context.stroke();
}
