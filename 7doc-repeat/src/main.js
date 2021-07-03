const { Random, Context, Anim } = bljs;
const { Toggle, Knob, Panel, Canvas } = mc;

/////////////////////////////
// Model
/////////////////////////////

const model = {
  speed: 0.05,
  copies: 100,
  fade: 0.95,
  spacing: 3,
  deconstruct: 0.5,
  randomize: 0.5,
  invert: false,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

new Knob(panel, 20, 40, "Speed", model.speed, -0.1, 0.1)
  .setDecimals(2)
  .bind(model, "speed");

new Knob(panel, 90, 40, "Copies", model.copies, 1, 100)
  .bind(model, "copies");

new Knob(panel, 20, 140, "Fade", model.fade, 0.9, 0.99)
  .setDecimals(2)
  .bind(model, "fade");

new Knob(panel, 90, 140, "Spacing", model.spacing, 1, 10)
  .bind(model, "spacing");

new Knob(panel, 20, 240, "Deconstruct", model.deconstruct, 0, 1)
  .setDecimals(2)
  .bind(model, "deconstruct");

new Knob(panel, 90, 240, "Randomize", model.randomize, 0, 5)
  .setDecimals(2)
  .bind(model, "randomize");

new Toggle(panel, 20, 340, "Invert", model.invert)
  .bind(model, "invert");
/////////////////////////////
// VIEW
/////////////////////////////

const lines = [];

context.lineWidth = 0.5;
let angle = 0;

const anim = new Anim(render);
anim.run();

function render(fps) {
  if (model.invert) {
    context.clearBlack();
    context.strokeStyle = "white";
  } else {
    context.clearWhite();
    context.strokeStyle = "black";
  }

  lines.forEach(line => {
    context.save();
    for (let i = 0; i < model.copies; i++) {
      context.strokePath(line);
      context.translate(Math.cos(angle) * model.spacing, Math.sin(angle) * model.spacing);
      context.lineWidth *= model.fade;
    }
    context.restore();
    line.forEach(p => {
      p.x += Random.float(-model.randomize, model.randomize);
      p.y += Random.float(-model.randomize, model.randomize);
    });
  });
  angle += model.speed;
  if (Random.bool(model.deconstruct)) {
    cull();
  }
}

function cull() {
  const line = lines[0];
  if (!line) {
    return;
  }
  line.shift();
  if (line.length === 0 && lines.length > 1) {
    lines.shift();
  }
}

canvas.addEventListener("mousedown", onMouseDown);

function onMouseDown(event) {
  points = [];
  lines.push(points);
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;
  points.push({x, y});
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(event) {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;
  points.push({x, y});
}

function onMouseUp(event) {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}
