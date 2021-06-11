const { Context, FPS, Noise, Num } = bljs;
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
const contourRes = 1;
const target = 0.1;
const res = 1;
const scale = 0.04;
const z = Math.random() * 10;
// const z = 4.606978787799588;
console.log(z);
init();
render();

function init() {
  // context.lineWidth = 0.4;
}

function render() {
  context.clearWhite();
  drawPerlin();

  const p = {x: 200, y: 200, dir: "n"};

  const path = findPath(p, target);
  if (path) {
    context.strokePath(path, true);
  }
  // requestAnimationFrame(render);
  // fps.logFrame();
}

function drawPerlin() {
  context.fillStyle = "#f00";

  for (let x = 0; x < 400; x += res) {
    for (let y = 0; y < 400; y += res) {
      const v = Noise.perlin(x * scale, y * scale, z);
      if (v > target) {
        context.fillRect(x, y, res, res);
      }
    }
  }
}

/*
 * 1. start somewhere.
 * 2. move north until cross boundary. save start location.
 * 3. if outside shape...
 *   a. if going downhill, turn right
 *   b. if going uphill, keep going straight
 *   c. repeat 4 until back inside shape
 * 4. if inside shape...
 *   a. if going uphill, turn left
 *   b. if going downhill, keep going
 *   c. repeat 4 until outside shape
 * 5. repeat 3-4 until location is within range of location found at 2.
 */
function findPath(point, t) {
  const path = [];
  p = {x: point.x, y: point.y, dir: "n"};
  findStart(p, t);
  context.strokeCircle(p.x, p.y, 5);
  path.push({x: p.x, y: p.y});

  let iter = 0;
  do {
    move(path, p, t);
    path.push({x: p.x, y: p.y});
    iter++;
    // console.log(Num.dist(p, path[0]));
    if (Num.dist(p, path[0]) <= contourRes && iter > 5) {
      break;
    }
  } while (iter < 10000);
  console.log("done", iter);
  return path;
}

function findStart(p, t) {
  let v = Noise.perlin(p.x * scale, p.y * scale, z);
  // move north until we are in the zone.
  if (v < t) {
    do {
      p.y--;
      v = Noise.perlin(p.x * scale, p.y * scale, z);
    }
    while (v < t);
  }
  // now keep moving north until we hit the edge of the zone.
  while (v >= t) {
    do {
      p.y--;
      v = Noise.perlin(p.x * scale, p.y * scale, z);
    }
    while (v >= t);
  }
}

function move(path, p, t) {
  const v0 = Noise.perlin(p.x * scale, p.y * scale, z);
  switch (p.dir) {
  case "n":
    p.y -= contourRes;
    break;
  case "e":
    p.x += contourRes;
    break;
  case "s":
    p.y += contourRes;
    break;
  case "w":
    p.x -= contourRes;
    break;
  }
  if (isInPath(path, p)) {
    turnLeft(p);
  }
  const v1 = Noise.perlin(p.x * scale, p.y * scale, z);
  const uphill = v1 > v0;
  const inside = v1 > t;
  if (!inside && !uphill) {
    turnRight(p);
  }
  if (inside && uphill) {
    turnLeft(p);
  }
}

function isInPath(path, p0) {
  let result = false;
  path.forEach(p1 => {
    if (p1.x === p0.x && p1.y === p0.y) {
      result = true;
    }
  });
  return result;
}

function turnRight(p) {
  switch (p.dir) {
  case "n":
    p.dir = "e";
    break;
  case "e":
    p.dir = "s";
    break;
  case "s":
    p.dir = "w";
    break;
  case "w":
    p.dir = "n";
    break;
  }
}

function turnLeft(p) {
  switch (p.dir) {
  case "n":
    p.dir = "w";
    break;
  case "e":
    p.dir = "n";
    break;
  case "s":
    p.dir = "e";
    break;
  case "w":
    p.dir = "s";
    break;
  }
}

