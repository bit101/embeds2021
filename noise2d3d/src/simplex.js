const { Color, Noise, Context, Anim } = bljs;
const { Toggle, HSlider, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 300;
const height = 300;
const model = {
  scale: 0.01,
  res: 5,
  color: false,
  x: 0,
  y: 0,
  z: 0,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 230 + width * 2, height + 40);
const canvas1 = new Canvas(panel, 190, 20, width, height);
const context1 = canvas1.context;
Context.extendContext(context1);

const canvas2 = new Canvas(panel, 510, 20, width, height);
const context2 = canvas2.context;
Context.extendContext(context2);

new HSlider(panel, 20, 40, "Noise Scale", model.scale, 0.001, 0.05)
  .setDecimals(3)
  .bind(model, "scale")
  .addHandler(render);

new HSlider(panel, 20, 80, "Resolution", model.res, 1, 10)
  .bind(model, "res")
  .addHandler(render);

new HSlider(panel, 20, 120, "X Offset", model.x, 0, 1000)
  .bind(model, "x")
  .addHandler(render);

new HSlider(panel, 20, 160, "Y Offset", model.y, 0, 1000)
  .bind(model, "y")
  .addHandler(render);

new HSlider(panel, 20, 200, "Z Offset", model.z, 0, 1000)
  .bind(model, "z")
  .addHandler(render);

new Toggle(panel, 20, 240, "Color", model.color)
  .bind(model, "color")
  .addHandler(render);

/////////////////////////////
// VIEW
/////////////////////////////

// const anim = new Anim(render);
// anim.run();

render();
function render(fps) {
  const z = model.z * 0.01;
  const res = model.res;
  context1.forEach(res, (x, y) => {
    if (model.color) {
      const h = Noise.simplex2Range(x + model.x, y + model.y, model.scale, 0, 360);
      context1.fillStyle = Color.hsv(h, 1, 1);
    } else {
      const g = Noise.simplex2Range(x + model.x, y + model.y, model.scale, 0, 255);
      context1.fillStyle = Color.gray(g);
    }
    context1.fillRect(x, y, res, res);
  });
  context2.forEach(res, (x, y) => {
    if (model.color) {
      const h = Noise.simplex3Range(x + model.x, y + model.y, z, model.scale, 0, 360);
      context2.fillStyle = Color.hsv(h, 1, 1);
    } else {
      const g = Noise.simplex3Range(x + model.x, y + model.y, z, model.scale, 0, 255);
      context2.fillStyle = Color.gray(g);
    }
    context2.fillRect(x, y, res, res);
  });
}
