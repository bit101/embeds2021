const { Random, Context, Anim } = bljs;
const { Label, Button, Checkbox, HSlider, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

class Agent {
  constructor(x, y, heading) {
    this.x = x;
    this.y = y;
    this.heading = heading;
    this.speed = Random.float(0.01, 0.3);
  }

  update() {
    this.x += Math.cos(this.heading) * this.speed;
    this.y += Math.sin(this.heading) * this.speed;
    this.heading += Random.float(-0.1, 0.1);
  }

  render(context) {
    context.fillRect(this.x - 0.5, this.y - 0.5, 1, 1);
  }
}

class AgentList {
  constructor() {
    this.agents = [];
  }

  addAgent(x, y, heading) {
    this.agents.push(new Agent(x, y, heading));
  }

  addRandomAgents(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.addAgent(x, y, Random.float(Math.PI * 2));
    }
  }

  update() {
    this.agents.forEach(agent => agent.update());
  }

  reset(x, y) {
    this.agents.forEach(agent => {
      agent.x = x;
      agent.y = y;
      agent.heading = Random.float(Math.PI * 2);
    });
  }

  render(context) {
    this.agents.forEach(agent => agent.render(context));
  }
}

const model = {
  agents: new AgentList(),
  blur: 0.5,
  fade: 98,
  clearOnReset: false,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);
context.fillStyle = "white";
context.clearBlack();

new HSlider(panel, 20, 40, "Blur", model.blur, 0, 10)
  .setWidth(120)
  .setDecimals(2)
  .bind(model, "blur");

new HSlider(panel, 20, 80, "Fade", model.fade, 90, 100)
  .setWidth(120)
  .setDecimals(1)
  .bind(model, "fade");

new Button(panel, 20, 120, "Reset", () => {
  if (model.clearOnReset) {
    context.clearBlack();
  }
  model.agents.reset(200, 200);
});

new Label(panel, 20, 150, "Or click on canvas to reset.");

new Checkbox(panel, 20, 180, "Clear on reset", model.clearOnReset)
  .bind(model, "clearOnReset");

const fpsLabel = new Label(panel, 160, 425, "FPS: ...");

/////////////////////////////
// VIEW
/////////////////////////////

model.agents.addRandomAgents(200, 200, 1000);

canvas.addEventListener("click", event => {
  if (model.clearOnReset) {
    context.clearBlack();
  }
  model.agents.reset(event.offsetX, event.offsetY);
});

const anim = new Anim(render);
anim.run();

function render(fps) {
  fpsLabel.text = "FPS: " + fps;
  model.agents.update();
  model.agents.render(context);

  context.filter = `blur(${model.blur}px) brightness(${model.fade}%)`;
  context.drawImage(context.canvas, 0, 0, 400, 400);
  context.filter = "blur()";
}
