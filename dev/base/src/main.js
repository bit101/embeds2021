const { Context, Anim } = bljs;
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

const anim = new Anim(render);
anim.run();

function render(fps) {

}
