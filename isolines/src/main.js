const { Context, Anim, Random } = bljs;
const { Label, VSlider, Toggle, Button, Panel, Canvas, PlayButton } = mc2;

/////////////////////////////
// MODEL
/////////////////////////////

let maxLength = 1000;
let inverted = false;
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
new Toggle(panel, 20, 100, "Inverted", false, updateColor)
  .setWidth(40);
new VSlider(panel, 33, 150, "Line Length", 1000, 20, 1000, event => maxLength = event.detail);
new VSlider(panel, 33, 350, "Line Width", 0.5, 0, 5, event => context.lineWidth = event.detail)
  .setDecimals(1);
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

  const p0 = getEndPoint(x, y, Math.PI / 6);
  const p1 = getEndPoint(x, y, Math.PI * 5 / 6);
  const p2 = getEndPoint(x, y, Math.PI * 1.5);

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(p0.x, p0.y);

  context.moveTo(x, y);
  context.lineTo(p1.x, p1.y);

  context.moveTo(x, y);
  context.lineTo(p2.x, p2.y);
  context.stroke();

  fpsLabel.text = "fps: " + fps;
}

function getEndPoint(x, y, angle) {
  const dx = Math.cos(angle) * 1.5;
  const dy = Math.sin(angle) * 1.5;
  // keep pushing out points until we hit another line, go off screen or reach maxLength.
  for (let i = 0; i < maxLength; i++) {
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
  if (inverted) {
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
  if (inverted) {
    context.clearBlack();
    context.strokeStyle = "white";
  } else {
    context.clearWhite();
    context.strokeStyle = "black";
  }
}

function updateColor(event) {
  inverted = event.detail;
  onClear();
}
