const { Window, VBox, HSlider } = mc2;
const { Random, Num, Color, Canvas, Context } = bljs;

//////////////////////////////
// Model
//////////////////////////////
const model = {
  lineWidth: 0.5,
  hueStart: 0,
  hueEnd: 90,
  yres: 2,
  random: 5,
  wave: 0.01,
  scale: 1,
  tilt: 0.3,
};

function updateModel() {
  model.lineWidth = lineWidthSlider.value;
  model.yres = yresSlider.value;
  model.random = randomSlider.value;
  model.hueStart = hueStartSlider.value;
  model.hueEnd = hueEndSlider.value;
  model.wave = waveSlider.value;
  model.scale = scaleSlider.value;
  model.tilt = tiltSlider.value;
  render();
}

//////////////////////////////
// Controls
//////////////////////////////
const width = 800;
const height = 800;
const demo = document.getElementById("demo");
const win = new Window(demo, "Controls", 20, 20, 220, 340);

const canvas = new Canvas(demo, width, height);
const context = canvas.context;

const vbox = new VBox(win, 20, 30, 20);
const lineWidthSlider = new HSlider(vbox, 0, 0, "Line Width", model.lineWidth, 0, 2, updateModel);
lineWidthSlider.decimals = 1;
const yresSlider = new HSlider(vbox, 0, 0, "Y Res", model.yres, 1, 20, updateModel);
const randomSlider = new HSlider(vbox, 0, 0, "Randomness", model.random, 0, 20, updateModel);
const waveSlider = new HSlider(vbox, 0, 0, "Wave", model.wave, 0.0, 0.05, updateModel);
waveSlider.decimals = 3;
const scaleSlider = new HSlider(vbox, 0, 0, "Scale", model.scale, 0.0, 1, updateModel);
scaleSlider.decimals = 2;
const tiltSlider = new HSlider(vbox, 0, 0, "Tilt", model.tilt, -1, 1, updateModel);
tiltSlider.decimals = 2;
const hueStartSlider = new HSlider(vbox, 0, 0, "Hue Start", model.hueStart, 0, 360, updateModel);
const hueEndSlider = new HSlider(vbox, 0, 0, "Hue End", model.hueEnd, 0, 360, updateModel);

//////////////////////////////
// View
//////////////////////////////
render();

function render() {
  if (model.tilt < 0) {
    context.globalCompositeOperation = "destination-over";
  } else {
    context.globalCompositeOperation = "source-over";
  }

  Random.seed(0);
  const points = createPoints();
  context.lineWidth = model.lineWidth;
  context.clearRect(0, 0, width, height);
  for (let i = 600; i >= 0; i -= model.yres) {
    let scale = (0.5 + Math.sin((600 - i) * model.wave) * 0.5) * model.scale;
    const hue = Num.map(i, 600, 0, model.hueStart, model.hueEnd);
    context.fillStyle = Color.hsv(hue, 1, 1);
    context.save();
    context.translate(width / 2, i + 100);
    context.scale(scale, scale);
    context.beginPath();
    context.multiLoop(points);
    context.restore();
    context.fill();
    context.stroke();
    scale *= model.scale,
    randomizePoints(points);
  }
}

function createPoints() {
  const num = 20;
  const points = [];
  for (let i = 0; i < num; i++) {
    const angle = Math.PI * 2 / num * i;
    points.push({
      x: Math.cos(angle) * 300,
      y: Math.sin(angle) * 300 * model.tilt,
    });
  }
  return points;
}

function randomizePoints(pointsList) {
  const s = model.random;
  pointsList.forEach(p => {
    p.x += Random.float(-s, s);
    p.y += Random.float(-s, s);
  });
}
