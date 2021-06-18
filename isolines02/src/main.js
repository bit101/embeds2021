const { Context, Anim, Random, Num } = bljs;
const { Checkbox, Label, Toggle, Button, Panel, Canvas, PlayButton, Knob } = mc2;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
  maxLength: 1000,
  inverted: false,
  resolution: 4,
  shake: 1,
  rotation: 0,
  doShake: true,
  top: true,
  right: true,
  left: true,
};
const w = 700;
const h = 700;

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 800, 740);
const canvas = new Canvas(panel, 80, 20, w, h);
const context = canvas.context;
Context.extendContext(context);
const playBtn = new PlayButton(panel, 20, 20, false);
new Button(panel, 20, 50, "Clear", onClear)
  .setWidth(40);
new Toggle(panel, 20, 100, "Inverted", false)
  .bind(model, "inverted")
  .addHandler(onClear)
  .setWidth(40);
new Knob(panel, 20, 150, "Line Length", model.maxLength, 20, 1000)
  .bind(model, "maxLength");
new Knob(panel, 20, 230, "Line Width", 0.5, 0.1, 5, event => context.lineWidth = event.detail)
  .setDecimals(1);
new Checkbox(panel, 20, 320, "Top", true)
  .bind(model, "top");
new Checkbox(panel, 20, 340, "Left", true)
  .bind(model, "left");
new Checkbox(panel, 20, 360, "Right", true)
  .bind(model, "right");
new Toggle(panel, 20, 410, "Shake", true)
  .bind(model, "doShake")
  .setWidth(40);
new Knob(panel, 20, 460, "Resolution", model.resolution, 4, 20)
  .bind(model, "resolution");
new Knob(panel, 20, 540, "Shake", model.shake, 0, 3)
  .bind(model, "shake")
  .setDecimals(1);
new Knob(panel, 20, 620, "Rotation", model.rotation, -180, 180)
  .bind(model, "rotation");
const fpsLabel = new Label(panel, 10, 720, 0);

/////////////////////////////
// VIEW
/////////////////////////////

context.lineCap = "round";
context.lineWidth = 0.5;
context.strokeStyle = "black";
context.clearWhite();

const anim = new Anim(render);
playBtn.bind(anim, "running");

function render(fps) {
  const x = Random.float(0, w);
  const y = Random.float(0, h);

  // very weird, if i remove this, the frame rate drops to 2-3 fps and slows down from there.
  // only seems to happen on firefox.
  // somehow effects the performance of the getImageData function. Not sure what's going on.
  // other functions work here too, as long as you somehow affect the context, it seems. ???
  context.moveTo(0, 0);
  const rot = model.rotation / 180 * Math.PI;

  const p0 = getEndPoint(x, y, Math.PI / 6 + rot);
  const p1 = getEndPoint(x, y, Math.PI * 5 / 6 + rot);
  const p2 = getEndPoint(x, y, Math.PI * 1.5 + rot);

  model.right && drawLine(x, y, p0.x, p0.y);
  model.left && drawLine(x, y, p1.x, p1.y);
  model.top && drawLine(x, y, p2.x, p2.y);

  fpsLabel.text = "fps: " + fps;
}

function drawLine(x0, y0, x1, y1) {
  context.beginPath();
  if (model.doShake) {
    const res = Num.dist(x0, y0, x1, y1) / model.resolution;
    for (let i = 0; i < res; i++) {
      const t = i / res;
      context.lineTo(x0 + (x1 - x0) * t + Random.float(-model.shake, model.shake), y0 + (y1 - y0) * t + Random.float(-model.shake, model.shake));
    }
  } else {
    context.moveTo(x0, y0);
  }
  context.lineTo(x1, y1);
  context.stroke();
}

function getEndPoint(x, y, angle) {
  const dx = Math.cos(angle) * 1.5;
  const dy = Math.sin(angle) * 1.5;
  // keep pushing out points until we hit another line, go off screen or reach maxLength.
  for (let i = 0; i < model.maxLength; i++) {
    if (hitTest(x, y) || x < 0 || x >= w || y < 0 || y >= h) {
      break;
    }
    x += dx;
    y += dy;
  }
  // return the point we ended off with.
  return {x: x, y: y};
}

function hitTest(x, y) {
  const pixel = getPixel(x, y);
  if (model.inverted) {
    // not black
    return pixel > 0;
  }
  // not white
  return pixel < 255;
}

function getPixel(x, y) {
  // get the red pixel of the specified pixel. (it's all black and white, so any rgb channel will do)
  return context.getImageData(Math.round(x), Math.round(y), 1, 1).data[0];
}

function onClear() {
  if (model.inverted) {
    context.clearBlack();
    context.strokeStyle = "white";
  } else {
    context.clearWhite();
    context.strokeStyle = "black";
  }
}
