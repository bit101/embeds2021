const { Color, Num, Context, Anim } = bljs;
const { NumericStepper, Toggle, HSlider, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
  wave1: 0.5,
  wave2: 1.5,
  wave3: 2.5,
  wave4: 3.5,
  gamma: 2.2,
  res: 4,
  color: false,
  inverted: false,
  waves: 4,
  twist: 0.1,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 210 + width, height + 40);
const canvas = new Canvas(panel, 190, 20, width, height);
const context = canvas.context;
Context.extendContext(context);

new NumericStepper(panel, 20, 40, "Waves", model.waves, 1, 4)
  .bind(model, "waves")
  .addHandler(render);
  
new HSlider(panel, 20, 80, "Wave 1", model.wave1, 0, 10)
  .bind(model, "wave1")
  .setDecimals(1)
  .addHandler(render);

const wave2 = new HSlider(panel, 20, 120, "Wave 2", model.wave1, 0, 10)
  .bind(model, "wave2")
  .setDecimals(1)
  .addHandler(render);

const wave3 = new HSlider(panel, 20, 160, "Wave 3", model.wave1, 0, 10)
  .bind(model, "wave3")
  .setDecimals(1)
  .addHandler(render);

const wave4 = new HSlider(panel, 20, 200, "Wave 4", model.wave1, 0, 10)
  .bind(model, "wave4")
  .setDecimals(1)
  .addHandler(render);

const gamma = new HSlider(panel, 20, 240, "Gamma", model.gamma, 0, 10)
  .bind(model, "gamma")
  .setDecimals(2)
  .addHandler(render);

new HSlider(panel, 20, 280, "Twist", model.twist, -2, 2)
  .bind(model, "twist")
  .setDecimals(2)
  .addHandler(render);

new Toggle(panel, 20, 320, "High Res", false, event => {
  const hires = event.detail;
  if (hires) {
    model.res = 1;
  } else {
    model.res = 4;
  }
  render();
});

new Toggle(panel, 20, 360, "Color Mode", model.color)
  .bind(model, "color")
  .addHandler(render);

new Toggle(panel, 20, 400, "Inverted", model.inverted)
  .bind(model, "inverted")
  .addHandler(render);

/////////////////////////////
// VIEW
/////////////////////////////

// const anim = new Anim(render);
// anim.run();
render();

function render() {
  wave2.setEnabled(model.waves > 1);
  wave3.setEnabled(model.waves > 2);
  wave4.setEnabled(model.waves > 3);
  gamma.setEnabled(!model.color);
  const res = model.res;
  context.clearWhite();
  for (let x = 0; x < width; x += res) {
    for (let y = 0; y < height; y += res) {
      const xxx = Num.map(x, 0, width, -Math.PI, Math.PI);
      const yyy = Num.map(y, 0, height, -Math.PI, Math.PI);
      const r = Math.sqrt(xxx * xxx + yyy * yyy) * model.twist;
      let xx = Math.cos(r) * xxx - Math.sin(r) * yyy;
      let yy = Math.cos(r) * yyy + Math.sin(r) * xxx;
      let d = Math.cos(xx * model.wave1) * Math.cos(yy * model.wave1);
      if (model.waves > 1) {
        d += Math.cos(xx * model.wave2) * Math.cos(yy * model.wave2);
      }
      if (model.waves > 2) {
        d += Math.cos(xx * model.wave3) * Math.cos(yy * model.wave3);
      }
      if (model.waves > 3) {
        d += Math.cos(xx * model.wave4) * Math.cos(yy * model.wave4);
      }
      d = Math.abs(d);
      d /= model.waves;
      if (model.inverted) {
        d = 1 - d;
      }
      if (model.color) {
        const h = d * 360;
        context.fillStyle = Color.hsv(h, 1, 1)
      } else {
        d = Math.pow(d, 1 / model.gamma);
        const g = d * 255;
        context.fillStyle = Color.gray(g);
      }
      context.fillRect(x, y, res, res);
    }
  }
}
