const { Num, Noise, Color, Context, Anim } = bljs;
const { Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
};

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

let z = 0;
const showPerlin = false;
const anim = new Anim(render);
anim.run();

function render(fps) {
  // context.lineWidth = 0.5;
  context.clearWhite();
  let res = 10;
  const scale = 0.01;
  if (showPerlin) {
    for (let x = 0; x < width; x += res) {
      for (let y = 0; y < height; y += res) {
        const n = Noise.perlin((x + res / 2) * scale, (y + res / 2) * scale, z);
        const h = Num.map(n, -1, 1, 0, 360);
        context.fillStyle = Color.hsv(h, 0.5, 1);
        context.fillRect(x, y, res, res);
      }
    }
  }
  const delta = 0.001;
  res = 4;
  for (let x = 0; x < width; x += res) {
    for (let y = 0; y < height; y += res) {
      const xx = (x + res / 2) * scale;
      const yy = (y + res / 2) * scale;
      let n1 = Noise.perlin(xx - delta, yy, z);
      let n2 = Noise.perlin(xx + delta, yy, z);
      const a = (n1 - n2) / (delta * 2);

      n1 = Noise.perlin(xx, yy - delta, z);
      n2 = Noise.perlin(xx, yy + delta, z);
      const b = (n1 - n2) / (delta * 2);
      context.beginPath();
      context.moveTo(x + res / 2, y + res / 2);
      context.lineTo(x + res / 2 + b * res, y + res / 2 - a * res);
      context.stroke();
    }
  }
  z += 0.01;
}
