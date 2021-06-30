const { Num, Noise, Context, Anim } = bljs;
const { Panel, Canvas, HSlider, ColorPicker } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
  scale: 1,
  z: 0,
  speed: 0.01,
  res: 100,
  points: [],
  trails: 1,
  backgroundColor: "#fff",
  lineColor: "#000",
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 600, 440);
const canvas = new Canvas(panel, 180, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

new HSlider(panel, 15, 40, "Scale", model.scale, 0.1, 2)
  .bind(model, "scale")
  .setDecimals(1);

new HSlider(panel, 15, 80, "Speed", model.speed, -0.05, 0.05)
  .bind(model, "speed")
  .setDecimals(3);

new HSlider(panel, 15, 120, "Resolution", model.res, 1, 100)
  .bind(model, "res");

new HSlider(panel, 15, 160, "Line Width", 1, 0.02, 10, event => context.lineWidth = event.detail)
  .setDecimals(2);

new HSlider(panel, 15, 200, "Trails", model.trails, 1, 100)
  .bind(model, "trails");

new ColorPicker(panel, 15, 240, "Lines", model.lineColor)
  .bind(model, "lineColor");

new ColorPicker(panel, 15, 280, "Background", model.backgroundColor)
  .bind(model, "backgroundColor")
  .setSliderPosition("top");

/////////////////////////////
// VIEW
/////////////////////////////

const anim = new Anim(render);
anim.run();

function render(fps) {
  const res = model.res * 16;
  context.save();
  context.fillStyle = model.backgroundColor;
  context.fillRect(0, 0, 400, 400);
  context.strokeStyle = model.lineColor;
  context.translate(200, 200);
  context.rotate(Math.PI / 4);
  const points = [];
  for (let i = 0; i < res; i++) {
    const angle = i / res * Math.PI * 2;
    const x = Math.cos(angle) * model.scale;
    const y = Math.sin(angle) * model.scale;
    const xx = Num.map(Noise.perlin(x, y, model.z), -1, 1, -200, 200);
    const yy = Num.map(Noise.perlin(y, x, model.z), -1, 1, -200, 200);
    points.push({x: xx, y: yy});
  }
  model.points.unshift(points);
  model.points.length = model.trails;
  model.points.forEach(trail => {
    context.strokePath(trail, true);
  });
  context.restore();
  model.z += model.speed;
}
