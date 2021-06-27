const { Context, Anim, Random } = bljs;
const { Button, Toggle, Panel, Canvas, Knob } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
  phase: 0,
  rotationSpeed: 0.01,
  numArms: 12,
  maxArms: 100,
  armLength: 20,
  maxArmLength: 50,
  movement: 0.001,
  lineWidth: 1,
  angle: 0,
  inverted: false,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

new Knob(panel, 20, 40, "Arm Count", model.numArms, 0, model.maxArms)
  .bind(model, "numArms");
new Knob(panel, 90, 40, "Speed", model.rotationSpeed, -0.1, 0.1)
  .bind(model, "rotationSpeed")
  .setDecimals(2);

new Knob(panel, 20, 140, "Movement", model.movement, 0, 0.05)
  .bind(model, "movement")
  .setDecimals(3);
new Knob(panel, 90, 140, "Line Width", model.lineWidth, 0.01, 10)
  .bind(model, "lineWidth")
  .setDecimals(2);

new Knob(panel, 20, 240, "Arm Length", model.armLength, 0, model.maxArmLength)
  .bind(model, "armLength");
new Knob(panel, 90, 240, "Angle", model.angle, -1, 1)
  .bind(model, "angle")
  .setDecimals(2);

new Toggle(panel, 50, 340, "Inverted", model.inverted)
  .bind(model, "inverted");

new Button(panel, 30, 380, "Straighten", straighten);
/////////////////////////////
// VIEW
/////////////////////////////

const arms = [];

for (let i = 0; i < model.maxArms; i++) {
  arms.push(createArm());
}

function createArm() {
  const arm = [];
  const rand = 0.5;
  let angle = 0;
  for (let i = 0; i < model.maxArmLength; i++) {
    angle += Random.float(-rand, rand);
    arm.push(angle);
  }
  return arm;
}

function updateArm(arm) {
  let update = Random.float(-model.movement, model.movement);
  arm.forEach((angle, index) => {
    arm[index] += update;
    update += Random.float(-model.movement, model.movement);
  });
}

function straighten() {
  arms.forEach(arm => {
    arm.forEach((angle, index) => {
      arm[index] *= 0.5;
    });
  });
}

const anim = new Anim(render);
anim.run();

function render(fps) {
  if (model.inverted) {
    context.clearBlack();
    context.strokeStyle = "white";
  } else {
    context.clearWhite();
    context.strokeStyle = "black";
  }
  context.lineWidth = model.lineWidth;
  context.save();
  context.translate(200, 200);

  for (let i = 0; i < model.numArms; i++) {
    const arm = arms[i];
    context.save();
    const a = i / model.numArms * Math.PI * 2;
    context.scale(Math.cos(model.phase + a), 1);
    context.rotate(model.angle);

    let x = 0;
    let y = 0;
    context.beginPath();
    context.moveTo(x, y);

    for (let j = 0; j < model.armLength; j++) {
      const angle = arm[j];
      x += Math.cos(angle) * 10;
      y += Math.sin(angle) * 10;

      context.lineTo(x, y);
    }
    context.restore();
    context.stroke();
    updateArm(arm);
  }

  context.restore();
  model.phase += model.rotationSpeed;
}
