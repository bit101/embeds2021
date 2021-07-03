const { Random, Noise, Context, Anim } = bljs;
const { Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);
context.lineWidth = 0.1;

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
      // context.points(this.points, 0.5);
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
  context.clearWhite();
  const qt = new QuadTree(0, 0, 400, 400, 3);

  const scale = 0.01;
  for (let i = 0; i < 5000; i++) {
    const x = Random.float(400);
    const y = Random.float(400);
    const n = Noise.perlin(x * scale, y * scale, z);
    if (n > 0) {
      qt.addPoint({x, y});
    }
  }
  z += 0.01;
  qt.draw(context);
}
