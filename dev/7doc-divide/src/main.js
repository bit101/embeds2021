const { Num, Color, Context, Random } = bljs;
const { Panel, Canvas } = mc;

// seismograph
// switches

/////////////////////////////
// MODEL
/////////////////////////////

const width = window.innerWidth;
const height = window.innerHeight;

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, width, height);
const canvas = new Canvas(panel, 0, 0, width, height);
const context = canvas.context;
Context.extendContext(context);
context.lineWidth = 0.5;
context.fillStyle = "#999";

/////////////////////////////
// VIEW
/////////////////////////////

subdivide(0, 0, width, height);

function subdivide(x, y, w, h) {
  const border = 2;
  if (w < 100 || h < 100) {
    drawPanel(x + border, y + border, w - border * 2, h - border * 2);
    return;
  }
  let ww = w;
  let hh = h;
  const ar = w / h;
  if (ar > 2) {
    ww = Random.float(0.45, 0.55) * w;
    subdivide(x, y, ww, hh);
    subdivide(x + ww, y, w - ww, hh);
  } else if (ar < 0.5) {
    hh = Random.float(0.45, 0.55) * h;
    subdivide(x, y, ww, hh);
    subdivide(x, y + hh, ww, h - hh);
  } else {
    ww = Random.float(0.30, 0.70) * w;
    hh = Random.float(0.30, 0.70) * h;
    subdivide(x, y, ww, hh);
    subdivide(x + ww, y, w - ww, hh);
    subdivide(x, y + hh, ww, h - hh);
    subdivide(x + ww, y + hh, w - ww, h - hh);
  }
}

function drawPanel(x, y, w, h) {
  context.save();
  context.fillStyle = Color.gray(Random.int(0xe0, 0xee));
  context.setShadow("#666", 0.25, 0.25, 0.5);
  context.fillRect(x, y, w, h);
  context.restore();
  const ar = w / h;
  if (Random.bool(0.02)) {
    drawWires(x, y, w, h);
  } else if (ar > 2.75) {
    drawHKnobs(x, y, w, h);
  } else if (ar > 2) {
    if (w < 150) {
      drawLightGrid(x, y, w, h);
    } else {
      drawSliders(x, y, w, h);
    }
  } else if (ar > 1.5) {
    if (h > 50 && h < 80) {
      drawDigits(x, y, w, h);
    } else {
      drawScreen(x, y, w, h);
    }
  } else if (ar > 0.85) {
    const r = Random.float();
    if (r > 0.667) {
      drawDial(x, y, w, h);
    } else if (r > 0.333) {
      drawDial2(x, y, w, h);
    } else {
      drawScope(x, y, w, h);
    }
  } else if (ar > 0.7) {
    if (Random.bool()) {
      drawGrille(x, y, w, h);
    } else {
      drawOsc(x, y, w, h);
    }
  } else if (ar > 0.5) {
    if (w < 60) {
      drawKeyPad(x, y, w, h);
    } else {
      drawSeismo(x, y, w, h);
    }
  } else if (ar > 0.4) {
    if (Random.bool()) {
      drawHex(x, y, w, h);
    } else {
      drawRoundLights(x, y, w, h);
    }
  } else {
    drawGauges(x, y, w, h);
  }
}

function drawDial(x, y, w, h) {
  context.save();
  const radius = h * Random.float(0.4, 0.3);
  const center = Random.float(0.2, 0.5);
  context.fillStyle = "#fff";
  context.fillCircle(x + w / 2, y + h / 2, radius);
  context.strokeCircle(x + w / 2, y + h / 2, radius);
  context.fillStyle = Color.gray(Random.int(128, 200));
  context.fillCircle(x + w / 2, y + h / 2, radius * center);
  const offset = Random.float(Math.PI * 0.5, Math.PI * 0.1);
  const arc0 = Math.PI / 2 + offset;
  const arc1 = Math.PI * 2.5 - offset;
  const num = w * 0.4;//Random.int(20, 50);
  for (let i = 0; i < num; i++) {
    const angle = Num.map(i, 0, num - 1, arc0, arc1);
    context.ray(x + w / 2, y + h / 2, angle, radius * 0.8, radius * 0.1);
  }
  const needleAngle = Random.float(arc0, arc1);
  context.ray(x + w / 2, y + h / 2, needleAngle, radius * center, radius * (0.9 - center));
  if (w > 60 && h > 60) {
    const inset = w / 10;
    const screw = inset / 4;
    context.fillCircle(x + inset, y + inset, screw);
    context.fillCircle(x + w - inset, y + inset, screw);
    context.fillCircle(x + inset, y + h - inset, screw);
    context.fillCircle(x + w - inset, y + h - inset, screw);
  }
  if (h > 80) {
    context.fillStyle = "#333";
    context.font = "6px Arial";
    context.textAlign = "center";
    context.fillText(Random.int(100000), x + w / 2, y + h / 2 + radius / 2 + 10);
  }
  context.restore();
}

function drawDial2(x, y, w, h) {
  console.log("dial 2");
  context.save();
  context.strokeStyle = "#666";
  context.fillStyle = "#fff";
  const border = 10;
  context.beginPath();
  context.roundRect(x + border, y + border, w - border * 2, h - border * 2, 5);
  context.fill();
  context.stroke();
  context.clip();
  context.beginPath();
  context.arc(x + w / 2, y + h, h - border * 2, 0, Math.PI * 2);
  context.stroke();
  const angle = Random.float(-Math.PI * 0.6, -Math.PI * 0.4);
  context.ray(x + w / 2, y + h, angle, 0, h - border * 1.5);

  context.fillStyle = "#ddd";
  context.fillRect(x, y + h * 0.6, w, h);

  if (h > 60) {
    context.fillStyle = "#333";
    context.font = "6px Arial";
    context.textAlign = "center";
    context.fillText(Random.int(1000000), x + w / 2, y + h - border - 6);
  }

  context.restore();
}

function drawScope(x, y, w, h) {
  context.save();
  const inset = w / 10;
  const border = inset * 1.5;
  context.beginPath();
  context.fillStyle = "#333";
  context.roundRect(x + border, y + border, w - border * 2, h - border * 2, 4);
  context.fill();
  const wavelength = Random.float(2, 10);
  const amp = Random.float(0.15, 0.47);
  context.beginPath();
  context.strokeStyle = "#ccc";

  for (let xx = x + border; xx < x + w - border; xx++) {
    const angle = xx / (w - border / 2) * Math.PI * 2 * wavelength;
    const yy = y + h / 2 - (Math.cos(angle * 1.73) + Math.sin(angle)) / 2 * (h - border * 2) * amp;
    context.lineTo(xx, yy);
  }
  context.stroke();
  if (w > 60 && h > 60) {
    const screw = inset / 4;
    context.fillCircle(x + inset, y + inset, screw);
    context.fillCircle(x + w - inset, y + inset, screw);
    context.fillCircle(x + inset, y + h - inset, screw);
    context.fillCircle(x + w - inset, y + h - inset, screw);
    context.fillStyle = "#333";
    context.font = "6px Arial";
    context.textAlign = "center";
    context.fillText(Random.int(1000000), x + w / 2, y + h - 4);
  }
  context.restore();
}

function drawScreen(x, y, w, h) {
  context.save();
  const inset = w / 20;
  const border = inset * 1.5;
  if (Random.bool()) {
    for (let xx = x + border; xx < x + w - border; xx++) {
      for (let yy = y + border; yy < y + h - border; yy++) {
        context.fillStyle = Color.randomGray();
        context.fillRect(xx, yy, 1, 1);
      }
    }
  } else {
    context.fillStyle = Color.gray(Random.int(0x22, 0x55));
    context.beginPath();
    context.roundRect(x + border, y + border, w - border * 2, h - border * 2, 4);
    context.fill();
    context.clip();
    context.fillStyle = "#eee";
    for (let yy = y + border + 5; yy < y + h - border; yy += 10) {
      context.font = "6px Arial";
      let str = "";
      const count = Random.int(5);
      for (let j = 0; j < count; j++) {
        str += Random.int(100000000);
      }
      context.fillText(str, x + border + 5, yy);
    }
  }

  context.lineWidth = 1;
  context.strokeStyle = "#333";
  context.strokeRoundRect(x + border, y + border, w - border * 2, h - border * 2, 4);
  context.restore();

  context.save();
  if (w > 60 && h > 60) {
    context.fillStyle = "#333";
    context.font = "6px Arial";
    context.textAlign = "center";
    context.fillText(Random.int(1000000), x + w / 2, y + h - 4);
  }
  context.restore();
}

function drawLightGrid(x, y, w, h) {
  const spacing = 5;
  const numx = 5;
  const numy = 3;
  const ww = (w - (numx + 1) * spacing) / numx;
  const hh = (h - (numy + 1) * spacing) / numy;

  context.save();
  context.translate(-1, -1);
  context.setShadow("#666", 0.5, 0.5, 0.5);
  let xx = x + spacing;
  let yy = y + spacing;
  for (let i = 0; i < numx; i++) {
    for (let j = 0; j < numy; j++) {
      context.fillStyle = Color.gray(Random.int(200, 255));
      context.fillRect(xx, yy, ww, hh);
      yy += hh + spacing;
    }
    yy = y + spacing;
    xx += ww + spacing;
  }
  context.restore();
}

function drawSliders(x, y, w, h) {
  context.save();
  const spacing = 15;
  const border = 5;
  const numx = Math.round(w / 30);
  const ww = (w - numx * spacing - border) / numx;
  const hh = h - border * 2;

  let xx = x + border;
  const yy = y + border;
  const borderStyle = Random.int(0x33, 0xcc);
  for (let i = 0; i < numx; i++) {
    context.strokeStyle = Color.gray(borderStyle);
    context.strokeRect(xx, yy, ww, hh);
    context.fillStyle = "#666";
    context.fillRect(xx + ww / 2 - 1, yy + border, 2, hh - border * 2);
    const handleWidth = Math.max(ww - 4, 10);
    const handleHeight = Math.min(ww / 2, 5);
    context.fillStyle = "#ccc";
    context.setShadow("#333", 0.25, 0.25, 0.5);
    context.fillRect(xx + ww / 2 - handleWidth / 2, yy + 10 + Random.float(hh - 20), handleWidth, handleHeight);
    context.setShadow(0, 0, 0, 0);
    context.fillStyle = "#999";
    for (let j = 0; j < 10; j++) {
      context.fillRect(xx + ww + 4, yy + 2 + j * hh / 10, spacing / 2, 1);
    }
    xx += ww + spacing;
  }
  context.restore();
}

function drawHKnobs(x, y, w, h) {
  const numx = Math.round(w / h);
  const ww = w / numx;
  const hh = h - 30;
  const radius = Math.max(Math.min(ww, hh) / 2, 5);

  context.save();
  context.lineWidth = 1;
  const knobColor = Color.gray(Random.int(128, 160));
  context.strokeStyle = "#fff";
  let xx = x + ww / 2;
  const yy = y + h / 8 + radius;
  for (let i = 0; i < numx; i++) {
    context.setShadow("#333", 1, 1, 1);
    context.fillStyle = knobColor;
    context.fillCircle(xx, yy, radius);
    context.setShadow(0, 0, 0, 0);
    context.ray(xx, yy, Random.float(Math.PI * 2), radius * 0.25, radius * 0.75);
    context.fillStyle = "#333";
    context.font = "6px Arial";
    context.textAlign = "center";
    context.fillText(Random.int(1000000), xx, y + h - 8);
    xx += ww;
  }
  if (w > 60 && h > 60) {
    context.fillStyle = "#333";
    const inset = h / 10;
    const screw = inset / 4;
    context.fillCircle(x + inset, y + inset, screw);
    context.fillCircle(x + w - inset, y + inset, screw);
    context.fillCircle(x + inset, y + h - inset, screw);
    context.fillCircle(x + w - inset, y + h - inset, screw);
  }
  context.restore();
}

function drawDigits(x, y, w, h) {
  context.save();
  const digits = [
    // top, left, right, mid, left, right, bottom
    [1, 1, 1, 0, 1, 1, 1],
    [0, 0, 1, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0, 1, 0],
    [1, 1, 0, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 1],
  ];
  const spacing = 5;
  const border = h / 5;
  const numx = 3;//Math.round(w / 50);
  const ww = (w - (numx - 1) * spacing - border * 2) / numx;
  const hh = h - border * 2;

  let xx = x + border;
  const yy = y + border;
  const bg = Random.int(0x22, 0x55);
  const fg = Random.int(0xcc, 0xee);
  for (let i = 0; i < numx; i++) {
    context.fillStyle = Color.gray(bg);
    context.fillRect(xx, yy, ww, hh);

    const digit = digits[Random.int(10)];
    context.fillStyle = Color.gray(fg);
    if (digit[0]) {
      context.fillRect(xx + 6, yy + 3, ww - 12, 2);
    }
    if (digit[3]) {
      context.fillRect(xx + 6, yy + hh / 2 - 1, ww - 12, 2);
    }
    if (digit[6]) {
      context.fillRect(xx + 6, yy + hh - 5, ww - 12, 2);
    }
    if (digit[1]) {
      context.fillRect(xx + 3, yy + 6, 2, hh / 2 - 9);
    }
    if (digit[2]) {
      context.fillRect(xx + ww - 5, yy + 6, 2, hh / 2 - 9);
    }
    if (digit[4]) {
      context.fillRect(xx + 3, yy + hh / 2 + 2, 2, hh / 2 - 8);
    }
    if (digit[5]) {
      context.fillRect(xx + ww - 5, yy + hh / 2 + 2, 2, hh / 2 - 8);
    }
    xx += ww + spacing;
  }
  context.restore();
}

function drawWires(x, y, w, h) {
  context.save();
  context.beginPath();
  context.rect(x, y, w, h);
  context.fillStyle = "#666";
  context.fillRect(x, y, w, h);
  context.clip();

  context.save();
  context.setShadow("#333", 1, 1, 1);
  const count = Random.int(15, 30);
  for (let i = 0; i < count; i++) {
    context.lineWidth = Random.int(2, 4);
    context.strokeStyle = Color.gray(Random.int(130, 220));
    context.beginPath();
    context.moveTo(x - 10, y + Random.float(-h, h * 2));
    context.quadraticCurveTo(
      x + Random.float(w), y + Random.float(h),
      x + w + 10, y + Random.float(-h, h * 2));
    context.stroke();
  }
  context.restore();

  if (Random.bool(0.7)) {
    context.save();
    context.fillStyle = "#ddd";
    context.translate(x + Random.float(-10, w * 0.2), y + Random.float(0.25, 0.75) * h);
    context.rotate(Random.float(-0.1, 0.1));
    context.fillRect(0, 0, w, h);
    context.fillStyle = "#333";
    for (let xx = 10; xx < w - 10; xx += 3) {
      for (let yy = 10; yy < h - 10; yy += 3) {
        context.fillCircle(xx, yy, 0.75);
      }
    }
    context.restore();
  }

  context.setShadow("#000", 10, 10, 20);
  context.fillRect(x - 20, y - 20, 20, h + 20);
  context.fillRect(x - 20, y - 20, w + 20, 20);
  context.restore();
}

function drawGrille(x, y, w, h) {
  context.save();
  const inset = w / 20;
  const border = inset * 3;
  const size = w - border * 2;
  context.fillStyle = "#333";
  for (let xx = x + border; xx < x + w - border; xx += 3) {
    for (let yy = y + h / 2 - size / 2; yy < y + h / 2 + size / 2; yy += 3) {
      context.fillCircle(xx, yy, 0.7);
    }
  }
  if (w > 60 && h > 60) {
    context.fillStyle = "#333";
    const screw = inset / 4;
    context.fillCircle(x + inset, y + inset, screw);
    context.fillCircle(x + w - inset, y + inset, screw);
    context.fillCircle(x + inset, y + h - inset, screw);
    context.fillCircle(x + w - inset, y + h - inset, screw);
  }
  context.restore();
}

function drawOsc(x, y, w, h) {
  context.save();
  const inset = w / 20;
  let r = Math.min(w, h) * 0.4;
  context.fillStyle = "#444";
  context.fillCircle(x + w / 2, y + h / 2, r);
  context.strokeStyle = "#eee";
  context.beginPath();
  r *= 0.6;
  let xa = 0;
  let ya = 0;
  const vx = Random.float(0.01, 0.1);
  const vy = Random.float(0.01, 0.1);
  for (let i = 0; i < 500; i++) {
    context.lineTo(x + w / 2 + Math.sin(xa) * r, y + h / 2 + Math.sin(ya) * r);
    xa += vx;
    ya += vy;
  }
  context.stroke();
  if (w > 60 && h > 60) {
    context.fillStyle = "#333";
    const screw = inset / 4;
    context.fillCircle(x + inset, y + inset, screw);
    context.fillCircle(x + w - inset, y + inset, screw);
    context.fillCircle(x + inset, y + h - inset, screw);
    context.fillCircle(x + w - inset, y + h - inset, screw);
  }
  context.restore();
}

function drawGauges(x, y, w, h) {
  context.save();
  if (w > 50) {
    const spacing = 10;
    const numy = 7;
    const ww = w - spacing * 2;
    const hh = (h - (numy + 1) * spacing) / numy;

    // context.translate(-1, -1);
    // context.setShadow("#666", 0.5, 0.5, 0.5);
    const xx = x + spacing;
    let yy = y + spacing;
    for (let j = 0; j < numy; j++) {
      context.fillStyle = "#555";
      context.fillRect(xx, yy, ww, hh);
      context.fillStyle = "#999";
      context.fillRect(xx, yy, ww * Random.float(), hh);
      yy += hh + spacing;
    }
  } else {
    const border = 10;
    context.fillStyle = "#999";
    context.fillRect(x + border, y + border, w - border * 2, h - border * 2);
    context.fillStyle = "#555";
    context.fillRect(x + border, y + border, w - border * 2, (h - border * 2) * Random.float());
  }
  context.restore();
}

function drawKeyPad(x, y, w, h) {
  context.save();
  const border = 10;
  const spacing = 2;
  const s = (w - border * 2 - spacing * 2) / 3;
  let xx = x + border;
  let yy = y + border;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      context.setShadow("#666", 0.5, 0.5, 0.5);
      context.fillStyle = "#eee";
      context.fillRect(xx, yy, s, s);
      context.setShadow(0, 0, 0, 0);
      context.fillStyle = "#333";
      context.font = s / 2 + "px Arial";
      context.textAlign = "center";
      if (j < 3) {
        context.fillText(j * 3 + i + 1, xx + s / 2, yy + s * .75);
      } else {
        context.fillText(["*", "0", "#"][i], xx + s / 2, yy + s * .75);
      }
      yy += s + spacing;
    }
    yy = y + border;
    xx += s + spacing;
  }
  const top = y + border * 2 + (s + spacing) * 4;
  context.translate(1, 0);
  for (xx = x + 9; xx < x + w - 9; xx += 3) {
    for (yy = top; yy < y + h - border; yy += 3) {
      context.fillCircle(xx, yy, 0.75);
    }
  }
  context.restore();
}

function drawSeismo(x, y, w, h) {
  context.save();
  const border = 5;
  const num = Random.int(3, 6);
  context.fillStyle = "#fff";
  context.beginPath();
  context.rect(x + border, y + border, w - border * 2, h - border * 2);
  context.fill();
  context.stroke();
  context.lineWidth = 0.2;
  context.grid(x + border, y + border, w - border * 2, h - border * 2, 6, 6);
  for (let i = 0; i < num; i++) {
    context.lineWidth = 0.5;
    const yy = (i + 1) / num * h * 0.8;
    context.beginPath();
    for (let j = x + border; j < x + w * 0.75; j += 2) {
      context.lineTo(j, y + yy + Random.float(-10, 10));
    }
    context.lineTo(x + w * 0.75, y + yy);
    context.stroke();
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x + w * 0.75, y + yy);
    context.lineTo(x + w - border, y + yy);
    context.stroke();
  }
  context.restore();
}

function drawHex(x, y, w, h) {
  context.save();
  context.fillHexGrid(x, y, w, h, 6, 5);
  context.beginPath();
  context.rect(x, y, w, h);
  context.clip();
  context.setShadow("#333", 5, 5, 10);
  context.fillRect(x - 20, y - 20, 20, h + 20);
  context.fillRect(x - 20, y - 20, w + 20, 20);
  const num = Random.int(3);
  for (let i = 0; i < num; i++) {
    context.translate(Random.float(x, x + w), Random.float(y, y + h));
    context.rotate(Random.float(Math.PI * 2));
    context.fillStyle = "#333";

    context.setShadow(0, 0, 0, 0);
    context.beginPath();
    context.moveTo(0, -6);
    context.lineTo(0, 6);
    context.moveTo(-4, -6);
    context.lineTo(4, 6);
    context.moveTo(4, -6);
    context.lineTo(-4, 6);
    context.stroke();
    context.fillEllipse(0, 0, 6, 3);
  }
  context.restore();
}

function drawRoundLights(x, y, w, h) {
  context.save();
  const numx = Math.floor(w / 20);
  const numy = Math.floor(h / 20);
  context.setShadow("#666", 0.5, 0.5, 0.5);
  for (let i = 0; i < numx; i++) {
    for (let j = 0; j < numy; j++) {
      context.fillStyle = Color.gray(Random.int(255, 200));
      console.log(i, j);
      context.fillCircle(x + (i + 0.5) / numx * w, y + (j + 0.5) / numy * h, 5);
    }
  }

  context.restore();
}
