const { Noise, Num, Color, Context, Anim } = bljs;
const { Label, Toggle, RadioButton, HSlider, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 600;
const height = 400;
const model = {
  scale: 0.02,
  res: 5,
  speed: 0.01,
  mode: "1d",
  color: false,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 210 + width, height + 40);
const canvas = new Canvas(panel, 190, 20, width, height);
const context = canvas.context;
Context.extendContext(context);

new HSlider(panel, 20, 40, "Noise Scale", model.scale, 0.001, 0.05)
  .setDecimals(3)
  .bind(model, "scale");

new HSlider(panel, 20, 80, "Noise Speed", model.speed, 0.0, 0.1)
  .setDecimals(3)
  .bind(model, "speed");

new HSlider(panel, 20, 120, "Resolution", model.res, 3, 20)
  .bind(model, "res");

new Label(panel, 20, 160, "Mode");

new RadioButton(panel, 30, 180, "mode", "1d", true)
  .bind(model, "mode");

new RadioButton(panel, 30, 200, "mode", "2d", false)
  .bind(model, "mode");

new Toggle(panel, 20, 240, "Color", model.color)
  .bind(model, "color");

/////////////////////////////
// VIEW
/////////////////////////////

let maxP = height / 2;
let minP = height / 2;
let maxS = height / 2;
let minS = height / 2;
let z = 0;
let offset = 0;
const anim = new Anim(render);
anim.run();

function render() {
  context.clearWhite();
  if (model.mode === "1d") {
    render1d();
  } else {
    render2d();
  }
}

function render2d() {
  const res = model.res;
  const scale = model.scale;
  for (let x = 0; x < width; x += res) {
    for (let y = 0; y < height; y += res) {
      let n;
      if (x > width / 2) {
        n = Noise.simplex(x * scale, y * scale, z);
      } else {
        n = Noise.perlin(x * scale, y * scale, z);
      }

      if (model.color) {
        const h = Num.map(n, -1, 1, 0, 360);
        context.fillStyle = Color.hsv(h, 1, 1);
      } else {
        const g = Num.map(n, -1, 1, 0, 255);
        context.fillStyle = Color.gray(g);
      }
      context.fillRect(x, y, res, res);
    }
  }
  z += model.speed;
}

function render1d() {
  context.save();
  context.strokeStyle = "black";
  context.lineWidth = 2;
  context.beginPath();
  for (let x = 0; x < width; x++) {
    const n = Noise.simplex1(x * model.scale + offset);
    const y = height / 2 + n * 200;
    maxS = Math.max(y, maxS);
    minS = Math.min(y, minS);
    context.lineTo(x, y);
  }
  context.stroke();

  context.lineWidth = 0.5;
  context.beginPath();
  context.moveTo(0, maxS);
  context.lineTo(width, maxS);
  context.moveTo(0, minS);
  context.lineTo(width, minS);
  context.stroke();

  context.strokeStyle = "red";
  context.lineWidth = 2;
  context.beginPath();
  for (let x = 0; x < width; x++) {
    const n = Noise.perlin1(x * model.scale + offset);
    const y = height / 2 + n * 200;
    maxP = Math.max(y, maxP);
    minP = Math.min(y, minP);
    context.lineTo(x, y);
  }
  context.stroke();

  context.lineWidth = 0.5;
  context.beginPath();
  context.moveTo(0, maxP);
  context.lineTo(width, maxP);
  context.moveTo(0, minP);
  context.lineTo(width, minP);
  context.stroke();

  context.restore();
  offset += model.speed;
}
