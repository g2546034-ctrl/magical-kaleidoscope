
let pg;

let selectedColor = "#00e5ff";
let brushSize = 4;
let isEraser = false;
let isDrawing = false;

let isRotating = false;
let rotationAngle = 0;
let rotationSpeed = 0.01;

const colors = [
  "#00e5ff", // シアン
  "#ff4fd8", // ピンク
  "#fff176", // イエロー
  "#a78bfa", // パープル
  "#ffffff", // ホワイト
  "#ff6b35", // オレンジ
  "#39ff14", // グリーン
  "#ff1744", // レッド
  "#2979ff", // ブルー
  "#f5a623"  // ゴールド
];

function setup() {
  createCanvas(700, 700);

  pg = createGraphics(700, 700);
  pg.background(10, 12, 30);

 createP("✦ 作れる万華鏡 ✦");
createP("自分だけの不思議な模様を作ろう");
  // カラーパレット
  createP("COLOR");
  for (let c of colors) {
    let btn = createButton("●");
    btn.style("color", c);
    btn.style("background", "#20243a");
    btn.style("font-size", "25px");
    btn.style("border", "none");
    btn.style("margin", "4px");
    btn.style("cursor", "pointer");

    btn.mousePressed(() => {
      selectedColor = c;
      isEraser = false;
    });
  }

  // ブラシサイズ
  createP("BRUSH SIZE");
  let brushSlider = createSlider(1, 20, 4);
  brushSlider.input(() => {
    brushSize = brushSlider.value();
  });

  // ペン・消しゴム
  createP("TOOLS");

  let penBtn = createButton("ペン");
  penBtn.mousePressed(() => isEraser = false);

  let eraserBtn = createButton("消しゴム");
  eraserBtn.mousePressed(() => isEraser = true);

  let clearBtn = createButton("全消去");
  clearBtn.mousePressed(() => {
    isRotating = false;
    rotationAngle = 0;
    pg.background(10, 12, 30);
  });

  // 回転機能
  createP("ROTATION");

  let rotateBtn = createButton("回転スタート");
  rotateBtn.mousePressed(() => {
    isRotating = !isRotating;
    rotateBtn.html(
      isRotating ? "一時停止" : "回転スタート"
    );
  });

  createP("回転速度");
  let speedSlider = createSlider(1, 50, 10);
  speedSlider.input(() => {
    rotationSpeed = speedSlider.value() * 0.001;
  });

  // 保存
  let saveBtn = createButton("画像を保存");
  saveBtn.mousePressed(() => {
    saveCanvas("KALEIDO", "png");
  });
}

function draw() {
  background(10, 12, 30);

  // 描いた模様を回転表示
  push();
  translate(width / 2, height / 2);
  rotate(rotationAngle);
  image(pg, -width / 2, -height / 2);
  pop();

  if (isRotating) {
    rotationAngle += rotationSpeed;
  }
}

// マウスを押したとき
function mousePressed() {
  if (isRotating) return;

  if (
    mouseX >= 0 && mouseX <= width &&
    mouseY >= 0 && mouseY <= height
  ) {
    isDrawing = true;

    drawSymmetry(
      mouseX - width / 2,
      mouseY - height / 2,
      mouseX - width / 2,
      mouseY - height / 2
    );
  }
}

// マウスを動かして描く
function mouseDragged() {
  if (isDrawing && !isRotating) {
    drawSymmetry(
      pmouseX - width / 2,
      pmouseY - height / 2,
      mouseX - width / 2,
      mouseY - height / 2
    );
  }
}

function mouseReleased() {
  isDrawing = false;
}

// 8方向に線を複製
function drawSymmetry(x1, y1, x2, y2) {
  pg.push();
  pg.translate(width / 2, height / 2);

  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI / 8 * i;

    pg.push();
    pg.rotate(angle);
    drawGlowingLine(x1, y1, x2, y2);
    pg.pop();

    pg.push();
    pg.rotate(angle);
    pg.scale(1, -1);
    drawGlowingLine(x1, y1, x2, y2);
    pg.pop();
  }

  pg.pop();
}

// ネオンのように光る線
function drawGlowingLine(x1, y1, x2, y2) {
  let ctx = pg.drawingContext;

  if (isEraser) {
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "destination-out";

    pg.stroke(255);
    pg.strokeWeight(brushSize * 3);
    pg.line(x1, y1, x2, y2);

    ctx.globalCompositeOperation = "source-over";
    return;
  }

  // 外側の光
  ctx.shadowBlur = 30;
  ctx.shadowColor = selectedColor;

  pg.stroke(selectedColor);
  pg.strokeWeight(brushSize * 2.5);
  pg.line(x1, y1, x2, y2);

  // 中間の光
  ctx.shadowBlur = 15;
  pg.stroke(selectedColor);
  pg.strokeWeight(brushSize * 1.5);
  pg.line(x1, y1, x2, y2);

  // 中心の白い線
  ctx.shadowBlur = 8;
  pg.stroke(255);
  pg.strokeWeight(brushSize * 0.5);
  pg.line(x1, y1, x2, y2);

  // 光の設定をリセット
  ctx.shadowBlur = 0;
}

// スマホで指を押したとき
function touchStarted() {
  if (isRotating) return false;

  if (
    mouseX >= 0 && mouseX <= width &&
    mouseY >= 0 && mouseY <= height
  ) {
    isDrawing = true;

    drawSymmetry(
      mouseX - width / 2,
      mouseY - height / 2,
      mouseX - width / 2,
      mouseY - height / 2
    );
  }

  return false;
}

// 指を動かしたとき
function touchMoved() {
  if (isDrawing && !isRotating) {
    drawSymmetry(
      pmouseX - width / 2,
      pmouseY - height / 2,
      mouseX - width / 2,
      mouseY - height / 2
    );
  }

  return false;
}

// 指を離したとき
function touchEnded() {
  isDrawing = false;
  return false;
}
