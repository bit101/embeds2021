const { Random, Noise, Num, Context, Anim } = bljs;
const { Panel, Canvas, PlayButton } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
  points: [],
  res: 10,
  scale: 0.01,
  dist: 4,
  offset: 1,
  z: 0,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 210 + width, height + 40);
const canvas = new Canvas(panel, 160, 20, width, height);
const context = canvas.context;
Context.extendContext(context);

/////////////////////////////
// VIEW
/////////////////////////////

model.points.push({
  x: width / 2 - 50,
  y: height / 2,
});
model.points.push({
  x: width / 2 + 50,
  y: height / 2,
});

const anim = new Anim(render);

new PlayButton(panel, 20, 40, false)
  .bind(anim, "running");

function render() {
  context.clearWhite();
  context.strokePath(model.points);
  model.points.forEach(p => {
    const n = Noise.perlin(p.x * model.scale, p.y * model.scale, model.z);
    const angle = n * Math.PI * 4;
    p.x += Math.cos(angle) * model.offset + Random.float(-0.1, 0.1);
    p.y += Math.sin(angle) * model.offset + Random.float(-0.1, 0.1);
  });

  const points = [];
  points.push(model.points[0]);
  for (let i = 0; i < model.points.length - 1; i++) {
    const p0 = model.points[i];
    const p1 = model.points[i + 1];
    const dist = Num.dist(p0.x, p0.y, p1.x, p1.y);
    if (dist > model.dist * 2) {
      points.push({x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2});
    }
    if (dist >= model.dist && p1.x > 0 && p1.x < width && p1.y > 0 && p1.y < height) {
      points.push(p1);
    }
  }
  model.points = points;
  if (model.points.length > 1000) {
    model.points.length = 1000;
  }
  model.z += 0.01;
  console.log(model.points.length);
}
