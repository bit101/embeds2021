const { Random, Noise, Context, Anim } = bljs;
const { HSlider, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
  scale: 0.01,
  speed: 0.01,
  count: 1000,
  limit: 3,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 210 + width, 40 + height);
const canvas = new Canvas(panel, 190, 20, width, height);
const context = canvas.context;
Context.extendContext(context);
context.lineWidth = 0.2;

new HSlider(panel, 20, 40, "Noise Scale", model.scale, 0.001, 0.1)
  .setDecimals(3)
  .bind(model, "scale");

new HSlider(panel, 20, 80, "Noise Speed", model.speed, 0.001, 0.1)
  .setDecimals(3)
  .bind(model, "speed");

new HSlider(panel, 20, 120, "Count", model.count, 100, 10000)
  .bind(model, "count");

new HSlider(panel, 20, 160, "Limit", model.limit, 1, 500)
  .bind(model, "limit");

class QuadTree {
  constructor(x, y, w, h, limit) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.limit = limit;
    this.points = [];
  }

  addPoint(point) {
    if (this.quads) {
      this.addToQuad(point);
    } else {
      this.points.push(point);
      if (this.points.length > this.limit) {
        this.makeQuads();
      }
    }
  }

  belongsHere(point) {
    return point.x >= this.x && point.x < this.x + this.w && point.y >= this.y && point.y < this.y + this.h;
  }

  addToQuad(point) {
    this.quads.forEach(quad => {
      if (quad.belongsHere(point)) {
        quad.addPoint(point);
      }
    });
  }

  makeQuads() {
    console.log("making quads");
    this.quads = [];
    this.quads.push(new QuadTree(this.x, this.y, this.w / 2, this.h / 2, this.limit));
    this.quads.push(new QuadTree(this.x + this.w / 2, this.y, this.w / 2, this.h / 2, this.limit));
    this.quads.push(new QuadTree(this.x, this.y + this.h / 2, this.w / 2, this.h / 2, this.limit));
    this.quads.push(new QuadTree(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, this.limit));
    while (this.points.length > 0) {
      const p = this.points.shift();
      this.addToQuad(p);
    }
  }

  draw(ctx) {
    if (this.quads) {
      this.quads.forEach(quad => quad.draw(ctx));
    } else {
      // context.fillCircle(this.x + this.w / 2, this.y + this.h / 2, this.w / 2);
      context.strokeRect(this.x, this.y, this.w, this.h);
      context.points(this.points, 1);
    }
  }
}

/////////////////////////////
// VIEW
/////////////////////////////

let z = 0;
const anim = new Anim(render);
anim.run();

function render() {
  Random.seed(0);
  context.clearWhite();
  const qt = new QuadTree(0, 0, 400, 400, model.limit);

  const scale = model.scale;
  for (let i = 0; i < model.count; i++) {
    const x = Random.float(width);
    const y = Random.float(height);
    const n = Noise.perlin(x * scale, y * scale, z);
    if (n > 0) {
      qt.addPoint({x, y});
    }
  }
  z += model.speed;
  qt.draw(context);
}
