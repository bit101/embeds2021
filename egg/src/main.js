////////////////////////////////////////
// MODEL
////////////////////////////////////////
const model = {
  size: 100,
  ratio: 1.5,
  sharpness: 0.15,
  res: 0.01,
  fill: "#cef",
  rotation: 0,
};

////////////////////////////////////////
// CONTROL VIEW
////////////////////////////////////////

const { Panel, Canvas, HSlider, ColorPicker } = mc;

const demo = document.getElementById("demo");
const panel = new Panel(demo, 0, 0, 800, 640);
const canvas = new Canvas(panel, 200, 20, 580, 580);
new HSlider(panel, 20, 30, "Size", model.size, 0, 180)
  .bind(model, "size")
  .addHandler(render);
;
HSlider.decimals = 2;
new HSlider(panel, 20, 70, "Ratio", model.ratio, 0, 5)
  .bind(model, "ratio")
  .addHandler(render);
new HSlider(panel, 20, 110, "Sharpness", model.sharpness, -1, 1)
  .bind(model, "sharpness")
  .addHandler(render);
new HSlider(panel, 20, 150, "Resolution", model.res, 0.01, Math.PI)
  .bind(model, "res")
  .addHandler(render);
new HSlider(panel, 20, 190, "Rotation", model.rotation, -Math.PI, Math.PI)
  .bind(model, "rotation")
  .addHandler(render);
new ColorPicker(panel, 20, 230, "Color", model.fill)
  .bind(model, "fill")
  .addHandler(render);

////////////////////////////////////////
// VIEW
////////////////////////////////////////
function render() {
  const context = canvas.context;
  const xr = 1.0;
  const yr = model.ratio;

  context.clearRect(0, 0, 600, 600);
  context.save();
  context.fillStyle = model.fill;
  context.translate(290, 290);
  context.rotate(model.rotation);

  context.beginPath();
  for (let i = 0; i < Math.PI * 2; i += model.res) {
    const y = Math.sin(i) * yr;
    const x = Math.cos(i) * xr * (1 + model.sharpness * y);
    context.lineTo(x * model.size, y * model.size);
  }
  context.fill();
  context.restore();
}

////////////////////////////////////////
// Kick it off
////////////////////////////////////////
render();

