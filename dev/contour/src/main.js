const { Context, FPS, Noise, Num } = bljs;
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
const contourRes = 4;
const res = 4;
const scale = 0.01;
const target = 0;
init();
render();

function init() {
}

function render() {
  context.clearWhite();
  context.fillStyle = "#ccc";

  for (let x = 0; x < 400; x += res) {
    for (let y = 0; y < 400; y += res) {
      const v = Noise.perlin2(x * scale, y * scale);
      if (v > 0.1) {
        context.fillRect(x, y, res, res);
      }
    }
  }
  context.fillStyle = "#000";

  const p = {x: 200, y: 200};
  context.fillCircle(p.x, p.y, 1);
  moveUp(p);
  context.beginPath();
  context.lineTo(p.x, p.y);
  let dir = moveLeft(p);
  for (let i = 0; i < 140; i++) {
    if (dir === "down") {
      dir = moveLeft(p);
    } else {
      dir = moveRight(p);
    }
    context.lineTo(p.x, p.y);
  }
  context.stroke();

  // do stuff here

  // requestAnimationFrame(render);
  // fps.logFrame();
}

function moveUp(p) {
  let v = Noise.perlin2(p.x * scale, p.y * scale);
  while (Math.abs(v - target) > 0.1) {
    p.y -= contourRes;
    v = Noise.perlin2(p.x * scale, p.y * scale);
  }
}

function moveDown(p) {
  let v = Noise.perlin2(p.x * scale, p.y * scale);
  while (Math.abs(v - target) > 0.1) {
    p.y += contourRes;
    v = Noise.perlin2(p.x * scale, p.y * scale);
  }
}

function moveLeft(p) {
  p.x -= contourRes;
  const v = Noise.perlin2(p.x * scale, p.y * scale);
  if (v > target) {
    moveDown(p);
    return "down";
  }
  moveUp(p);
  return "up";
}

function moveRight(p) {
  p.x += contourRes;
  const v = Noise.perlin2(p.x * scale, p.y * scale);
  if (v > target) {
    moveUp(p);
    console.log("up");
    return "up";
  }
  moveDown(p);
  console.log("down");
  return "down";
}

