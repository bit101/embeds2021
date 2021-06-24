const { Context, DragPoint, Num, Random } = bljs;
const { Panel, Canvas, VBox, Checkbox } = mc;

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

const vbox = new VBox(panel, 20, 30, 10);
const circumCenterCB = new Checkbox(vbox, 0, 0, "CircumCenter", true, render);
const circumCircleCB = new Checkbox(vbox, 0, 0, "CircumCircle", true, render);
const centroidCB = new Checkbox(vbox, 0, 0, "Centroid", true, render);
const orthoCenterCB = new Checkbox(vbox, 0, 0, "OrthoCenter", true, render);

/////////////////////////////
// VIEW
/////////////////////////////

const p0 = new DragPoint(Random.float(0, 400), Random.float(0, 400), "0", context, render);
const p1 = new DragPoint(Random.float(0, 400), Random.float(0, 400), "1", context, render);
const p2 = new DragPoint(Random.float(0, 400), Random.float(0, 400), "2", context, render);

render();

function render() {
  context.clearWhite();
  context.strokeStyle = "black";
  context.beginPath();
  context.moveTo(p0.x, p0.y);
  context.lineTo(p1.x, p1.y);
  context.lineTo(p2.x, p2.y);
  context.lineTo(p0.x, p0.y);
  context.stroke();
  p0.render();
  p1.render();
  p2.render();

  const cc = Num.circumCenter(p0, p1, p2);
  if (cc) {
    const radius = Num.dist(cc.x, cc.y, p0.x, p0.y);

    if (circumCenterCB.checked) {
      context.fillCircle(cc.x, cc.y, 5);
    }
    if (circumCircleCB.checked) {
      context.strokeStyle = "red";
      context.strokeCircle(cc.x, cc.y, radius);
    }
  }

  if (centroidCB.checked) {
    const ct = Num.centroid(p0, p1, p2);
    context.fillRect(ct.x - 5, ct.y - 5, 10, 10);
  }

  if (orthoCenterCB.checked) {
    const oc = Num.orthoCenter(p0, p1, p2);
    context.beginPath();
    context.strokeStyle = "black";
    context.moveTo(oc.x - 5, oc.y);
    context.lineTo(oc.x + 5, oc.y);
    context.moveTo(oc.x, oc.y - 5);
    context.lineTo(oc.x, oc.y + 5);
    context.stroke();
  }
}

