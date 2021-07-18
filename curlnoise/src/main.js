const { Noise, Random, Context, Anim } = bljs;
const { Toggle, PlayButton, HSlider, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
  scale: 0.01,
  z: 0,
  points: [],
  force: 1,
  speed: 0.01,
  size: 1,
  inverted: true,
};

for (let i = 0; i < 500; i++) {
  const p = Random.point(0, 0, width, height);
  p.vx = 0;
  p.vy = 0;
  model.points.push(p);
}

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 210 + width, height + 40);
const canvas = new Canvas(panel, 190, 20, width, height);
const context = canvas.context;
Context.extendContext(context);
context.fillStyle = "white";

new HSlider(panel, 20, 40, "Particle Speed", model.force, 0, 10)
  .setDecimals(2)
  .bind(model, "force");

new HSlider(panel, 20, 80, "Particle Size", model.size, 0, 20)
  .setDecimals(1)
  .bind(model, "size");

new HSlider(panel, 20, 120, "Noise Speed", model.speed, 0, 0.03)
  .setDecimals(3)
  .bind(model, "speed");

new HSlider(panel, 20, 160, "Noise Scale", model.scale, 0.001, 0.04)
  .setDecimals(3)
  .bind(model, "scale");

new Toggle(panel, 20, 200, "Inverted", model.inverted)
  .bind(model, "inverted");

/////////////////////////////
// VIEW
/////////////////////////////

const anim = new Anim(render);

new PlayButton(panel, 20, 240, false)
  .bind(anim, "running");

function render() {
  if (model.inverted) {
    context.clearBlack();
    context.fillStyle = "white";
  } else {
    context.clearWhite();
    context.fillStyle = "black";
  }
  model.points.forEach(updatePoint);
  model.z += model.speed;
}

function updatePoint(p) {
  if (p.x > width + model.size) {
    p.x = -model.size;
    p.y = Random.float(height);
  } else if (p.x < -model.size) {
    p.x = width + model.size;
    p.y = Random.float(height);
  }
  if (p.y > height + model.size) {
    p.x = Random.float(width);
    p.y = -model.size;
  } else if (p.y < -model.size) {
    p.x = Random.float(width);
    p.y = height + model.size;
  }
  const scale = model.scale;
  const curl = getCurl(p.x * scale, p.y * scale, model.z);
  p.x += curl.x * model.force;
  p.y += curl.y * model.force;
  context.fillCircle(p.x, p.y, model.size);
}

function getCurl(x, y, z) {
  const delta = 0.0001;
  let n1 = Noise.perlin(x + delta, y, z);
  let n2 = Noise.perlin(x - delta, y, z);
  const cy = -(n1 - n2) / (delta * 2);

  n1 = Noise.perlin(x, y + delta, z);
  n2 = Noise.perlin(x, y - delta, z);
  const cx = (n1 - n2) / (delta * 2);

  return { x: cx, y: cy };
}
