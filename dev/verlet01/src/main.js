const { Random, Context, Anim } = bljs;
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

// other controls here

/////////////////////////////
// VIEW
/////////////////////////////

const anim = new Anim(render);
// anim.run();

function render(fps) {
  context.beginPath();
  context.moveTo(Random.float(400), Random.float(400));
  context.lineTo(Random.float(400), Random.float(400));
  context.stroke();
}
