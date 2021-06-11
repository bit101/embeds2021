const { Context, Num, Random, DragPoint } = bljs;
const { Panel, Canvas, HSlider, VBox, RadioButton, NumericStepper } = mc2;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
  t: 0,
  mode: "linear",
  start: {x: 20, y: 200},
  end: {x: 560, y: 200},
  sineHeight: 50,
  sineCycles: 1,
  bez0: {x: 100, y: 50},
  bez1: {x: 300, y: 350},
  fractalSegment: 40,
  fractalRoughness: 0.5,
  fractalSeed: 0,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 800, 480);
const canvas = new Canvas(panel, 200, 20, 580, 400);
const context = canvas.context;
Context.extendContext(context);
// Defaults.hslider.height = 12;
// Defaults.hslider.handleSize = 12;

let vbox = new VBox(panel, 20, 20, 10);
new RadioButton(vbox, 0, 0, "g", "linear", true).bind(model, "mode").addHandler(render);
new RadioButton(vbox, 0, 0, "g", "sine", false).bind(model, "mode").addHandler(render);
new RadioButton(vbox, 0, 0, "g", "bezier", false).bind(model, "mode").addHandler(render);
new RadioButton(vbox, 0, 0, "g", "fractal", false).bind(model, "mode").addHandler(render);

vbox = new VBox(panel, 20, 130, 20);
new HSlider(vbox, 0, 0, "Sine Height", 50, -200, 200).bind(model, "sineHeight").addHandler(render);
new HSlider(vbox, 0, 0, "Sine Cycles", 1, 0, 40).bind(model, "sineCycles").addHandler(render);

vbox = new VBox(panel, 20, 240, 20);
new HSlider(vbox, 0, 0, "Fractal Roughness", 0.5, 0, 1)
  .bind(model, "fractalRoughness")
  .addHandler(render)
  .setDecimals(2);
new HSlider(vbox, 0, 0, "Fractal Segment", 20, 5, 100)
  .bind(model, "fractalSegment")
  .addHandler(render);
new NumericStepper(vbox, 0, 0, "Fractal Seed", 0, 0, 10000).bind(model, "fractalSeed").addHandler(render);

new HSlider(panel, 200, 450, "Tween", 0, 0, 1)
  .bind(model, "t")
  .addHandler(render)
  .setDecimals(2)
  .setWidth(580);

model.start = new DragPoint(model.start.x, model.start.y, context, render);
model.end = new DragPoint(model.end.x, model.end.y, context, render);
model.bez0 = new DragPoint(model.bez0.x, model.bez0.y, context, render);
model.bez1 = new DragPoint(model.bez1.x, model.bez1.y, context, render);

/////////////////////////////
// VIEW
/////////////////////////////

init();
render();

function init() {
  context.lineWidth = 0.5;
}

function render() {
  const { t, start, end, sineHeight, sineCycles, mode, bez0, bez1 } = model;
  context.clearWhite();
  context.fillStyle = "#ccc";
  model.start.render();
  model.end.render();

  let x, y, p;
  switch (mode) {
  case "linear":
    x = Num.map(t, 0, 1, start.x, end.x);
    y = Num.map(t, 0, 1, start.y, end.y);
    context.fillStyle = "#000";
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(x, y);
    context.stroke();
    break;

  case "sine":
    sineLine();
    p = sineTween(t, start.x, start.y, end.x, end.y, sineHeight, sineCycles);
    x = p.x;
    y = p.y;
    break;

  case "bezier":
    context.fillStyle = "#ccc";
    model.bez0.render();
    model.bez1.render();
    bezLine();
    p = Num.bezier(start, bez0, bez1, end, t);
    x = p.x;
    y = p.y;
    break;

  case "fractal":
    Random.seed(model.fractalSeed);
    context.fillStyle = "#000";
    const points = makePath();
    p = points[points.length - 1];
    x = p.x;
    y = p.y;
    // If you don't understand what's going on here, don't feel bad.
    // I'm sure I won't understand it next week.
    // Let me try to document it a bit...

    // how many fractal segments do we have? one less than the number of points.
    const segCount = points.length - 1;
    // the last segment we have completed (based on t).
    const seg = Math.floor(segCount * model.t);
    // subtract the completed segment percent from t and multiply by segCount.
    // this gives us how far we are into the current segment (percentage wise)
    const segT = (t - seg / segCount) * segCount;
    if (seg < points.length - 1) {
      // last completed point + segT percent of the length of the next segment.
      x = points[seg].x + (points[seg + 1].x - points[seg].x) * segT;
      y = points[seg].y + (points[seg + 1].y - points[seg].y) * segT;
      // remove any points beyond the last completed one, add this partially completed point.
      points.length = seg + 1;
      points.push({x, y});
    }
    context.strokePath(points);
    break;
  }
  context.fillCircle(x, y, 4);
}

function sineTween(t, x0, y0, x1, y1, amp, cycles) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const angle = Math.atan2(dy, dx);
  const angle2 = angle + Math.PI / 2;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const h = -Math.sin(t * Math.PI * 2 * cycles) * amp;
  // straight up linear interpolation between the two points.
  let x = x0 + Math.cos(angle) * dist * t;
  let y = y0 + Math.sin(angle) * dist * t;
  // then add the sinewave, angled to be perpendicular to the line.
  x += Math.cos(angle2) * h;
  y += Math.sin(angle2) * h;
  return {x, y};
}

function sineLine() {
  context.fillStyle = "#000";
  context.beginPath();
  context.moveTo(model.start.x, model.start.y);
  for (let t = 0; t < model.t; t += 1 / (model.sineCycles * 100)) {
    const p = sineTween(t, model.start.x, model.start.y, model.end.x, model.end.y, model.sineHeight, model.sineCycles);

    context.lineTo(p.x, p.y);
  }
  context.stroke();
}

function bezLine() {
  context.fillStyle = "#000";
  context.beginPath();
  context.moveTo(model.start.x, model.start.y);
  for (let t = 0; t <= model.t; t += 1 / (model.sineCycles * 100)) {
    const p = Num.bezier(model.start, model.bez0, model.bez1, model.end, t);
    context.lineTo(p.x, p.y);
  }
  context.stroke();
}

function makePath() {
  const points = [];
  const rough = model.fractalRoughness * 3;
  const segment = model.fractalSegment;
  let p = {x: model.start.x, y: model.start.y};
  points.push(p);
  let dist;
  do {
    // calculate the angle from the current point to the end point.
    // then randomly shift it a bit to the left or right.
    // note, `rough` must be less than PI or you will very likely end up with an infinite line.
    const dx = model.end.x - p.x;
    const dy = model.end.y - p.y;
    const angle = Math.atan2(dy, dx) + Random.float(-rough, rough);
    dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < segment) {
      // we're close enough to the end point. done.
      break;
    }
    // create a new point `segment` pixels away from the current point at the new angle.
    const x = p.x + Math.cos(angle) * segment;
    const y = p.y + Math.sin(angle) * segment;
    p = {x, y};
    points.push(p);
  } while (true);
  points.push(model.end);
  return points;
}
