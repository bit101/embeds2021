const { Noise, Random, Context, Anim } = bljs;
const { HSlider, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
  fill: 0.22,
  scale: 0.07,
  z: 0,
  speed: 0.02,
  size: 10,
  startTime: 0,
  fps: 15,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 210 + width, height + 40);
const canvas = new Canvas(panel, 190, 20, width, height);
const context = canvas.context;
Context.extendContext(context);
context.imageSmoothingEnabled = false;

new HSlider(panel, 20, 40, "Noise Threshold", model.fill, 0, 0.6)
  .bind(model, "fill")
  .setDecimals(2);

new HSlider(panel, 20, 80, "Noise Scale", model.scale, 0.02, 0.2)
  .bind(model, "scale")
  .setDecimals(2);

new HSlider(panel, 20, 120, "Noise Speed", model.speed, 0.00, 0.1)
  .bind(model, "speed")
  .setDecimals(3);

new HSlider(panel, 20, 160, "Max FPS", model.fps, 0, 60)
  .bind(model, "fps");

new HSlider(panel, 20, 200, "Cube Size", model.size, 5, 50)
  .bind(model, "size");

/////////////////////////////
// VIEW
/////////////////////////////

const anim = new Anim(render);
anim.run();

// render();

function render(fps) {
  const now = Date.now();
  if (now - model.startTime < 1000 / model.fps) {
    return;
  }
  model.startTime = now;

  context.globalCompositeOperation = "copy";
  context.drawImage(context.canvas, 0, model.size);
  context.globalCompositeOperation = "source-over";

  context.save();
  context.translate(width / 2, height / 2);
  const count = 200 / model.size;
  const z = count;

  // for (let z = 0; z < count; z++) {
  for (let x = 0; x < count; x++) {
    for (let y = 0; y < count; y++) {
      const n = Noise.perlin(x * model.scale, y * model.scale, z * model.scale + model.z);
      if (n > model.fill) {
        isoCube(x, y, z);
      }
    }
  }
  // }
  model.z += model.speed;

  context.restore();
}

function isoCube(x, y, z) {
  const size = model.size;
  const deg60 = Math.PI / 3;

  context.save();
  context.translate( (x - y) * Math.sin(deg60) * size, (x + y) * Math.cos(deg60) * size - z * size);

  // background / top
  context.save();
  context.fillStyle = "#eee";
  context.beginPath();
  for (let i = 0; i < 6; i++) {
    context.lineTo(0, size);
    context.rotate(deg60);
  }
  context.fill();
  context.restore();

  // left
  context.save();
  context.fillStyle = "#999";
  context.beginPath();
  context.moveTo(0, 0);
  for (let i = 0; i < 3; i++) {
    context.lineTo(0, size);
    context.rotate(deg60);
  }
  context.fill();
  context.restore();

  // right
  context.save();
  context.fillStyle = "#ccc";
  context.beginPath();
  context.moveTo(0, 0);
  for (let i = 0; i < 3; i++) {
    context.lineTo(0, size);
    context.rotate(-deg60);
  }
  context.fill();
  context.restore();

  // stroke
  context.save();
  context.lineWidth = 0.2;
  context.beginPath();
  for (let j = 0; j < 3; j++) {
    context.moveTo(0, 0);
    for (let i = 0; i < 3; i++) {
      context.lineTo(0, size);
      context.rotate(-deg60);
    }
    context.rotate(deg60);
  }
  context.stroke();
  context.restore();

  context.restore();
}
