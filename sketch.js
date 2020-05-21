
// Logical model
workspaceW = 210;
workspaceH = workspaceW * 270 / 170;

cameraLocation = [0, 0];
cameraAngle = 180;
renderCameraDirection = true;

apiInput = {
  "width": 640, "height": 448,
  "bboxList": [
    {"x": 0, "w": 50, "d": 0.7},
    {"x": 400, "w": 50, "d": 0.9},
    {"x": 500, "w": 50, "d": 0.2}
  ]
};

apiDistanceLimits = [0.6, 0.8];

// Rendering

univW = 500;
univH = 400;

minDim = Math.min(univW, univH);

multiplierW = minDim / 400;
multiplierH = minDim / 400;
multiplierZ = minDim / 400;

let carModel;
let roadTexture;
function preload()
{
  carModel = loadModel('models/model_sedancar.obj');
  roadTexture = loadImage('assets/roadTexture.jpg');
}

function setup() {
  univW = windowWidth;
  univH = windowHeight;

  minDim = Math.min(univW, univH);

  multiplierW = minDim / 400;
  multiplierH = minDim / 400;
  multiplierZ = minDim / 400;

  createCanvas(univW, univH, WEBGL);
}

var xRotate = 1.1;
var yRotate = 0;
var pointLightBrightness = 150;

function draw() {
  ambientLight(140);

  pointLight(pointLightBrightness, 
    pointLightBrightness, 
    pointLightBrightness, 0, -univH, 150);

  skybox();
  push();
  rotateX(xRotate);
  rotateY(yRotate);
  plotData();
  pop();
}

function mouseDragged() {
  if (mouseButton === LEFT)
  {
    xRotate -= movedY / 100;
    yRotate += movedX / 100;
  }
}

function doubleClicked() {
  xRotate = 1;
  yRotate = 0;
}

function plotData()
{
  fill(color(160,82,45));
  noStroke();
  texture(roadTexture);
  box(workspaceW * multiplierW, 
      workspaceH * multiplierH,
      10 * multiplierZ);
  plotCameraSprite();
  if (renderCameraDirection)
    plotCameraDirection();
  plotApiData();
}

function plotApiData()
{
  redColor = color(230,69,0, 255);
  orangeColor = color(255,140,0, 255);
  greenColor = color(173,255,47, 255);
  outlineColor = color(255,255,255, 190);
  
  dimW = apiInput.width;
  dimH = apiInput.height;
  for (el of apiInput.bboxList)
  {
    selColor = redColor;
    if (el.d  > apiDistanceLimits[0])
      selColor = orangeColor;
    if (el.d > apiDistanceLimits[1])
      selColor = greenColor;
    
    stroke(outlineColor);
    x = calcX(el, dimW);
    y = calcY(el, dimH);
    plotCar(x, y, selColor);
  }
}

function calcX(el, mWidth)
{
  mulL2W = workspaceW / mWidth;
  return - el.x * mulL2W * multiplierW + 
    int(workspaceW * multiplierW / 2);
}

function calcY(el, mHeight)
{
  mulL2W = workspaceH / 2;
  return el.d * mulL2W * multiplierH;
}

function plotCameraDirection()
{
  push();
  translate(0, 0, 10 * multiplierZ + 1);
  stroke(color(255,255,0));
  line(-50 * multiplierW, 0,
       50 * multiplierW, 0);
  line(0, 0, 0, 100 * multiplierH);
  pop();
}

function plotCameraSprite()
{
  fill(color(0,191,255, 150));
  stroke(color(30,144,255));
  plotCar(0, 0, color(150, 150, 230));
}

function plotCar(x, y, colorParam)
{
  push();
  translate(x, y, 10 * multiplierZ + 1);
  scale(10 * multiplierW);
  normalMaterial();
  ambientMaterial(250);
  fill(colorParam);
  rotateX(1.5);
  model(carModel);
  pop();
}

function plotCar_orig(x, y)
{
  push();
  translate(x, y, 10 * multiplierZ + 1);
  box(15 * multiplierW,
      30 * multiplierH,
      10 * multiplierZ);
  pop();
}

function skybox()
{
  background(135,206,250);
}
