const { Num, Color, Noise, Random, Context, Anim } = bljs;
const { PlayButton, Toggle, Button, HSlider, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
  scale: 0.005,
  z: 0,
  points: [],
  speed: 0.01,
  size: 1,
  inverted: true,
  speed: 1.75,
  curl: 0.6,
  lineWidth: 0.1,
  trails: false,
  showPerlin: false,
};

for (let i = 0; i < 500; i++) {
  const p = Random.point(0, 0, width, height);
  p.heading = Random.float(Math.PI * 2);
  model.points.push(p);
}
/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 210 + width, height + 40);
const canvas = new Canvas(panel, 190, 20, width, height);
const context = canvas.context;
Context.extendContext(context);
context.lineWidth = model.lineWidth;

new HSlider(panel, 20, 40, "Curl", model.curl, 0, 1)
  .setDecimals(2)
  .bind(model, "curl")
  .addHandler(clear);

new HSlider(panel, 20, 80, "Speed", model.speed, 0, 5)
  .setDecimals(2)
  .bind(model, "speed")
  .addHandler(clear);

new HSlider(panel, 20, 120, "Line Width", model.lineWidth, 0, 1)
  .setDecimals(2)
  .bind(model, "lineWidth")
  .addHandler(clear);

new HSlider(panel, 20, 160, "Noise Z", model.z, 0, 10)
  .setDecimals(2)
  .bind(model, "z")
  .addHandler(clear);

new HSlider(panel, 20, 200, "Noise Scale", model.scale, 0.001, 0.1)
  .setDecimals(3)
  .bind(model, "scale")
  .addHandler(clear);

new Toggle(panel, 20, 240, "Show Perlin", model.showPerlin)
  .bind(model, "showPerlin")
  .addHandler(clear);

new Toggle(panel, 100, 240, "Show Trails", model.trails)
  .bind(model, "trails")
  .addHandler(clear);

new Button(panel, 20, 400, "Clear", clear);

/////////////////////////////
// VIEW
/////////////////////////////

const anim = new Anim(render);
anim.run();
new PlayButton(panel, 20, 280, true)
  .bind(anim, "running");

function render(fps) {
  if (!model.trails) {
    clear();
  }
  context.fillStyle = "black";
  context.lineWidth = model.lineWidth;
  model.points.forEach(update);
}

function clear() {
  context.clearWhite();
  if (model.showPerlin) {
    drawPerlin();
  }
}

function drawPerlin() {
  const res = 10;
  const scale = model.scale;
  for (let x = 0; x < width; x += res) {
    for (let y = 0; y < height; y += res) {
      const n = Noise.perlin((x + res / 2) * scale, (y + res / 2) * scale, model.z);
      context.fillStyle = Color.hsv(Num.map(n, -1, 1, 0, 360), 0.5, 1);
      context.fillRect(x, y, res, res);
    }
  }
}

function update(p) {
  const scale = model.scale;
  const n = Noise.perlin(p.x * scale, p.y * scale, model.z);
  p.heading += n * model.curl;
  if (model.trails) {
    context.beginPath();
    context.moveTo(p.x, p.y);
  }
  p.x += Math.cos(p.heading) * model.speed;
  p.y += Math.sin(p.heading) * model.speed;
  if (model.trails) {
    context.lineTo(p.x, p.y);
    context.stroke();
  } else {
    context.fillCircle(p.x, p.y, model.size);
  }

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
}
