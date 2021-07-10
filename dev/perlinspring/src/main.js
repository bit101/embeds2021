const { Noise, Num, Context, Anim } = bljs;
const { Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
  angle: 0,
  speed: 0.01,
  scale: 0.01,
  radius: 1,
  z: 0,
  points: [],
};

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.damp = 0.99;
    this.k = 0.01;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.damp;
    this.vy *= this.damp;
  }

  springTo(x, y) {
    this.vx += (x - this.x) * this.k;
    this.vy += (y - this.y) * this.k;
  }

  render(context) {
    context.fillCircle(this.x, this.y, 1);
  }
}

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 210 + width, height + 40);
const canvas = new Canvas(panel, 160, 20, width, height);
const context = canvas.context;
Context.extendContext(context);

// other controls here

/////////////////////////////
// VIEW
/////////////////////////////

const point = new Particle(0, 0);

const anim = new Anim(render);
anim.run();

function render(fps) {
  context.clearWhite();
  context.save();
  context.translate(width / 2, height / 2);

  const x = Math.cos(model.angle) * model.radius;
  const y = Math.sin(model.angle) * model.radius;
  const n = Noise.perlin2(x * model.scale, y * model.scale, model.z);
  const xx = Num.map(Noise.perlin(x, y, model.z), -1, 1, -200, 200);
  const yy = Num.map(Noise.perlin(y, x, model.z), -1, 1, -200, 200);

  context.strokeCircle(xx, yy, 4);

  point.springTo(xx, yy);
  point.update();
  point.render(context);
  model.points.push({x: point.x, y: point.y});
  if (model.points.length > 100) {
    model.points.shift();
  }
  context.strokePath(model.points);

  model.z += 0.01;
  model.angle += model.speed;
  context.restore();
}
