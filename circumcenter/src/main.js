const { Context, DragPoint, Num, Random } = bljs;
const { Panel, Canvas, TextBox } = mc;

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 580, 440);
const canvas = new Canvas(panel, 160, 20, 400, 400);
const context = canvas.context;
Context.extendContext(context);

new TextBox(panel, 20, 20, "The circumcenter is the center of a triangle's circumcircle. It can be found as the intersection of the perpendicular bisectors.")
  .setFontSize(13)
  .setSize(120, 200);

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

  const pX = Num.circumCenter(p0, p1, p2);
  if (pX) {
    const radius = Num.dist(pX.x, pX.y, p0.x, p0.y);

    context.fillCircle(pX.x, pX.y, 5);
    context.strokeStyle = "red";
    context.strokeCircle(pX.x, pX.y, radius);
  }
}

