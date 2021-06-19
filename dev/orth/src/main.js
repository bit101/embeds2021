const { Context, DragPoint, Num } = bljs;
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

/////////////////////////////
// VIEW
/////////////////////////////

const p0 = new DragPoint(100, 100, "0", context, render);
const p1 = new DragPoint(200, 100, "1", context, render);
const p2 = new DragPoint(100, 200, "2", context, render);

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

  // const A = Num.dist(p0.x, p0.y, p1.x, p1.y);
  // const B = Num.dist(p1.x, p1.y, p2.x, p2.y);
  // const C = Num.dist(p2.x, p2.y, p0.x, p0.y);
  const pX = orthoCenter(p0, p1, p2);
  context.fillCircle(pX.x, pX.y, 5);
  context.strokeStyle = "red";
  context.beginPath();
  context.moveTo(pX.x, pX.y);
  context.lineTo(p0.x, p0.y);
  context.moveTo(pX.x, pX.y);
  context.lineTo(p1.x, p1.y);
  context.moveTo(pX.x, pX.y);
  context.lineTo(p2.x, p2.y);
  context.stroke();
}

function orthoCenter(p0, p1, p2) {
  const slopeA = -(p1.x - p0.x) / (p1.y - p0.y);
  const pA = {
    x: p2.x + 100,
    y: p2.y + slopeA * 100,
  };
  const slopeB = -(p2.x - p1.x) / (p2.y - p1.y);
  console.log(slopeB);
  const pB = {
    x: p0.x + 100,
    y: p0.y + 100 * slopeB,
  };

  return Num.lineIntersect(p2, pA, p0, pB);
}

// function lineIntersect(p0, p1, p2, p3) {
//   const A1 = p1.y - p0.y;
//   const B1 = p0.x - p1.x;
//   const C1 = A1 * p0.x + B1 * p0.y;
//   const A2 = p3.y - p2.y;
//   const B2 = p2.x - p3.x;
//   const C2 = A2 * p2.x + B2 * p2.y;
//   const denominator = A1 * B2 - A2 * B1;

//   if (denominator === 0) {
//     return null;
//   }

//   const intersectX = (B2 * C1 - B1 * C2) / denominator;
//   const intersectY = (A1 * C2 - A2 * C1) / denominator;

//   return {
//     x: intersectX,
//     y: intersectY,
//   };
// }
