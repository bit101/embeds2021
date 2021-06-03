const { Context, FPS } = bljs;
const { Panel, Canvas } = mc2;

/////////////////////////////
// MODEL
/////////////////////////////

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

// other controls here

const fps = new FPS(panel, 160, 425);
fps.start();

/////////////////////////////
// VIEW
/////////////////////////////

init();
render();

function init() {
}

function render() {
  context.clearWhite();

  // do stuff here

  requestAnimationFrame(render);
  fps.logFrame();
}

