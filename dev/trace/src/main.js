const { Num, Anim, Context, Noise } = bljs;
const { PlayButton, ColorPicker, Toggle, HSlider, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
  circle: false,
  hollow: false,
  scale: 0.05,
  size: 100,
  z: 0,
  speed: 0.05,
  res: 1,
  color: "#000",
  tilt: 0.5,
  spin: Math.PI / 4,
  shadowX: 1,
  shadowY: -1,
  shadowBlur: 4,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 520);
const canvas = new Canvas(panel, 160, 20, 400, 480);
const context = canvas.context;

const buffer = document.createElement("canvas");
buffer.width = 400;
buffer.height = 480;
const bufferContext = buffer.getContext("2d");

Context.extendContext(context);
Context.extendContext(bufferContext);
// context.fillStyle = "#eee";

new HSlider(panel, 20, 40, "Noise Scale", model.scale, 0.001, 0.1)
  .setDecimals(3)
  .setWidth(120)
  .bind(model, "scale");

new HSlider(panel, 20, 80, "Noise Speed", model.speed, 0.001, 0.1)
  .setDecimals(3)
  .setWidth(120)
  .bind(model, "speed");

new HSlider(panel, 20, 120, "Layer Resolution", model.res, 1, 10)
  .setWidth(120)
  .bind(model, "res");

new HSlider(panel, 20, 160, "Size", model.size, 10, 200)
  .setWidth(120)
  .bind(model, "size");

new HSlider(panel, 20, 200, "Tilt", model.tilt, 0.1, 1)
  .setDecimals(2)
  .setWidth(120)
  .bind(model, "tilt");

new HSlider(panel, 20, 240, "Spin", 45, 0, 360, event => {
  model.spin = event.detail / 180 * Math.PI;
})
  .setWidth(120);

new Toggle(panel, 20, 280, "Circle", model.circle)
  .bind(model, "circle");

new Toggle(panel, 80, 280, "Hollow", model.hollow)
  .bind(model, "hollow");

new ColorPicker(panel, 20, 320, "Color", model.color)
  .setSliderPosition("top")
  .bind(model, "color");

new HSlider(panel, 20, 360, "Shadow X", model.shadowX, -5, 5)
  .setWidth(120)
  .bind(model, "shadowX");

new HSlider(panel, 20, 400, "Shadow Y", model.shadowY, -5, 5)
  .setWidth(120)
  .bind(model, "shadowY");

new HSlider(panel, 20, 440, "Shadow Blur", model.shadowBlur, 0, 5)
  .setWidth(120)
  .bind(model, "shadowBlur");

const playButton = new PlayButton(panel, 20, 480, true);

/////////////////////////////
// VIEW
/////////////////////////////

const anim = new Anim(render);
anim.run();

playButton.bind(anim, "running");

function render() {
  context.globalCompositeOperation = "copy";
  context.drawImage(context.canvas, 0, model.res);
  context.globalCompositeOperation = "source-over";

  bufferContext.clearRect(0, 0, 400, 480);
  bufferContext.fillStyle = "#fff";
  bufferContext.save();
  bufferContext.translate(200, 100);
  bufferContext.scale(1, model.tilt);
  bufferContext.rotate(model.spin);
  perl(-model.size, -model.size, model.size * 2, model.size * 2);
  bufferContext.restore();

  context.setShadow(model.color, model.shadowX, model.shadowY, model.shadowBlur);
  context.drawImage(buffer, 0, 0);
  model.z += model.speed;
}

function perl(x, y, w, h) {
  for (let i = x; i < x + w; i++) {
    for (let j = x; j < y + h; j++) {
      if (shouldDraw(i, j)) {
        const n = Noise.perlin(i * model.scale, j * model.scale, model.z);
        if (n > 0) {
          bufferContext.fillRect(i, j, 1.5, 1.5);
        }
      }
    }
  }
}

function shouldDraw(x, y) {
  if (model.circle) {
    return isInRing(x, y);
  }
  if (model.hollow) {
    return (x < -model.size + 10 || x > model.size - 10 || y < -model.size + 10 || y > model.size - 10);
  }
  return true;
}

function isInRing(x, y) {
  const dist = Num.dist(x, y, 0, 0);
  if (dist < model.size) {
    if (model.hollow) {
      return dist > model.size - 10;
    }
    return true;
  }
  return false;
}
