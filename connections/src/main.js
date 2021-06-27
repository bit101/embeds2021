const { Context, Anim, Random, Num } = bljs;
const { Panel, Canvas, Knob, ColorPicker, PlayButton, Button, Label } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const innerPoints = [];
const outerPoints = [];
const model = {
  maxDist: 50,
  radius: 200,
  maxConnections: 1000,
  connections: 0,
  innerColor: "#f00",
  outerColor: "#000",
  lineWidth: 1,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 780, 640);
const canvas = new Canvas(panel, 160, 20, 600, 600);
const context = canvas.context;
Context.extendContext(context);

new Knob(panel, 20, 40, "Radius", model.radius, 0, 300, reset)
  .bind(model, "radius");
new Knob(panel, 100, 40, "Max Dist", model.maxDist, 0, 200, reset)
  .bind(model, "maxDist");

new Knob(panel, 20, 140, "Connections", model.maxConnections, 100, 10000, reset)
  .bind(model, "maxConnections");
new Knob(panel, 100, 140, "Line Width", model.lineWidth, 0.05, 5, reset)
  .bind(model, "lineWidth")
  .setDecimals(2);

new ColorPicker(panel, 20, 240, "Inner", model.innerColor, reset)
  .bind(model, "innerColor");
new ColorPicker(panel, 20, 280, "Outer", model.outerColor, reset)
  .bind(model, "outerColor");
const bgPicker = new ColorPicker(panel, 20, 320, "Background", "#fff", reset);

const connLabel = new Label(panel, 20, 360, "Connections: 0");
const playButton = new PlayButton(panel, 20, 390, true);
new Button(panel, 80, 390, "Reset", reset)
  .setWidth(60);

/////////////////////////////
// VIEW
/////////////////////////////

const anim = new Anim(render);
anim.run();
playButton.bind(anim, "running");

function render(fps) {
  const p = Random.point(0, 0, 600, 600);
  if (Num.pointInCircle(p.x, p.y, 300, 300, model.radius)) {
    context.strokeStyle = model.innerColor;
    connect(p, innerPoints);
  } else {
    context.strokeStyle = model.outerColor;
    connect(p, outerPoints);
  }
}

function connect(p0, points) {
  model.connections++;
  connLabel.text = "Connections: " + model.connections;
  if (model.connections > model.maxConnections) {
    anim.stop();
    playButton.setPlaying(false);
    playButton.setEnabled(false);
  }
  points.forEach(p1 => {
    const dist = Num.dist(p0.x, p0.y, p1.x, p1.y);
    if (dist < model.maxDist) {
      context.lineWidth = Num.map(dist, 0, model.maxDist, model.lineWidth, 0);
      context.beginPath();
      context.moveTo(p0.x, p0.y);
      context.lineTo(p1.x, p1.y);
      context.stroke();
    }
  });
  points.push(p0);
}

function reset() {
  model.connections = 0;
  innerPoints.length = 0;
  outerPoints.length = 0;
  context.clearRGB(bgPicker.red, bgPicker.green, bgPicker.blue);
  playButton.setEnabled(true);
}
