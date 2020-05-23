
// Logical model
workspaceW = 210;
workspaceH = workspaceW * 270 / 170;

cameraLocation = [0, 0];
cameraAngle = 180;
maxDistanceFromCameraInWorkspace = Math.max(workspaceW, workspaceH) / 2;
renderCameraDirection = true;
renderCameraFov = true;

apiInput = {
  "width": 640, "height": 448, 
  "cameraFovAngle": 130,
  "bboxList": [
    {"x": 0, "w": 50, "d": 0.7},
    {"x": 400, "w": 50, "d": 0.9},
    {"x": 500, "w": 50, "d": 0.2}
  ]
};

// apiInput = {
//   "width": 640, "height": 448, 
//   "cameraFovAngle": 130,
//   "bboxList": [
//     {"x": 0, "w": 50, "d": 0.2},
//     {"x": 0, "w": 50, "d": 0.5},
//     {"x": 0, "w": 50, "d": 0.9},
//     {"x": 320, "w": 50, "d": 0.2},
//     {"x": 320, "w": 50, "d": 0.5},
//     {"x": 320, "w": 50, "d": 0.9},
//     {"x": 640, "w": 50, "d": 0.2},
//     {"x": 640, "w": 50, "d": 0.5},
//     {"x": 640, "w": 50, "d": 0.9}
//   ]
// };

apiDistanceLimits = [0.6, 0.8];

// Rendering

let carModel;
let roadTexture;
function preload()
{
  carModel = loadModel('models/model_sedancar.obj');
  roadTexture = loadImage('assets/roadTexture.jpg');
}


let univW;
let univH;

let minDim;

let multiplierW;
let multiplierH;
let multiplierZ;

let maxDistanceFromCameraInUniv;
let minDistanceFromCameraGap;
function setup() {
  univW = windowWidth;
  univH = windowHeight;

  minDim = Math.min(univW, univH);

  multiplierW = minDim / 400;
  multiplierH = minDim / 400;
  multiplierZ = minDim / 400;

  maxDistanceFromCameraInUniv = maxDistanceFromCameraInWorkspace * Math.max(multiplierW, multiplierH);
  minDistanceFromCameraGap = 10 * multiplierW;

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
  if (renderCameraFov)
    plotCameraFov();
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
  cameraFovAngle = apiInput.cameraFovAngle;
  for (el of apiInput.bboxList)
  {
    selColor = redColor;
    if (el.d  > apiDistanceLimits[0])
      selColor = orangeColor;
    if (el.d > apiDistanceLimits[1])
      selColor = greenColor;
    
    stroke(outlineColor);
    thetaDegree = el.x * cameraFovAngle / dimW;
    offsetAngleDegree = (180 - thetaDegree) / 4;
    offsetAppliedThetaDegree = offsetAngleDegree + thetaDegree;
    appliedThetaRadian = offsetAppliedThetaDegree * Math.PI / 180;
    distanceFromCameraUniv = el.d * maxDistanceFromCameraInUniv + minDistanceFromCameraGap;
    x = calcX(distanceFromCameraUniv, appliedThetaRadian);
    y = calcY(distanceFromCameraUniv, appliedThetaRadian);
    console.log(x, y);
    plotCar(x, y, selColor);
  }
}

function calcX(distance, theta)
{
  return Math.cos(theta) * distance;
}

function calcY(distance, theta)
{
  return Math.sin(theta) * distance;
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

function plotCameraFov()
{
  push();
  translate(0, 0, 10 * multiplierZ + 1);
  stroke(color(200));

  thetaDegree = 0;
  offsetAngleDegree = (180 - thetaDegree) / 4;
  offsetAppliedThetaDegree = offsetAngleDegree + thetaDegree;
  appliedThetaRadian = offsetAppliedThetaDegree * Math.PI / 180;
  distanceFromCameraUniv = 0.6 * maxDistanceFromCameraInUniv + minDistanceFromCameraGap;
  x = calcX(distanceFromCameraUniv, appliedThetaRadian);
  y = calcY(distanceFromCameraUniv, appliedThetaRadian);

  line(0, 0, x, y);

  cameraFovAngle = apiInput.cameraFovAngle;
  thetaDegree = cameraFovAngle;
  offsetAngleDegree = (180 - thetaDegree) / 4;
  offsetAppliedThetaDegree = offsetAngleDegree + thetaDegree;
  appliedThetaRadian = offsetAppliedThetaDegree * Math.PI / 180;
  distanceFromCameraUniv = 0.6 * maxDistanceFromCameraInUniv + minDistanceFromCameraGap;
  x = calcX(distanceFromCameraUniv, appliedThetaRadian);
  y = calcY(distanceFromCameraUniv, appliedThetaRadian);

  line(0, 0, x, y);
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

// function plotCar_orig(x, y)
// {
//   push();
//   translate(x, y, 10 * multiplierZ + 1);
//   box(15 * multiplierW,
//       30 * multiplierH,
//       10 * multiplierZ);
//   pop();
// }

function skybox()
{
  background(135,206,250);
}
