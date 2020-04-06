
let flock;
var d=10;
let debugv;
let wall;
let walls;
let atarget;
let avoid;
let bcount=0;
let rad = 45;
let bs;
let tc;
let tentaclen = []; 
let k=1;
let b = [];
let c=0;
let boidgen;

function setup() {
  createCanvas(640, 360);

  createP("click mouse near bottom right corner to generate new boids.");
  bs = createCheckbox('Boid_circle',false);
  debugv = createCheckbox('Boid_vision',false);
  debugv.changed(debugvision);
  wall = createCheckbox('Wall',false);
  walls = createSlider(10,140,10);
  atarget = createCheckbox('Activate_target_(mouse)',false);
  avoid = createCheckbox('avoid_obstacle_(mouse)',false);
  tc = createCheckbox('Triangle+circle',true);
  boidgen = createCheckbox('Boid generator space',false);

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 1; i++) {
    b[i] = new Boid(width / 2,height / 2);
    flock.addBoid(b[i]);
  }
    sett(100);
}

function draw() {
  d=walls.value();
  background(51);

  fill(200);
  text('Boid count:'+bcount,10,30);

  noFill();
  stroke(255);
  line(pmouseX,pmouseY,mouseX,mouseY);
  
  if(wall.checked()){
    stroke(255);
    noFill();
    rectMode(CENTER);
    rect(width/2, height/2, width-d*2, height-d*2);
  }

  if(dist(mouseX,mouseY,width-50,height-50)<rad) 
  if (mouseIsPressed) 
  if (mouseButton == LEFT)  
  {
    b[++c] = new Boid(mouseX, mouseY);
    flock.addBoid(b[c]);
  }

  if(boidgen.checked())
  ellipse(width-50, height-50,rad*2,rad*2);

  noFill();
  if(avoid.checked())
  fill(255,0,0);
  ellipse(mouseX,mouseY,20,20);
  fill(255);
  stroke(255);
  ellipse(mouseX,mouseY,10,10);
  
  flock.run();
  
  for(let i=0;i<c+1;i++)
  tentaclen[i].follow(b[i].position.x,b[i].position.y);
  k=c+1;
  un(k);
}


function debugvision(){
  if(this.checked()){
    Boid.dvnval=1;
  }
  else{
    Boid.dvnval=0;
  }
}

function sett(n){
  let pointn = [];
  for (let i = 0; i < n; i++)
    pointn[i] = new p5.Vector(random(100), random(100));
  let currentn = [];
  for (let i = 0; i < n; i++)
    currentn[i] = new Segment(pointn[i], 0, 0);
  let nextn = [];
  for (let j = 0; j < n; j++)
    for (let i = 0; i < 40; i++) {
    nextn[j] = new Segment(currentn[j], 1, i);
    currentn[j].child = nextn[j];
    currentn[j] = nextn[j];
  }
  for (let i = 0; i < n; i++)
    tentaclen[i] = currentn[i];
}

function un(n){
 
  for (let i = 0; i < n; i++){
    tentaclen[i].update();
    tentaclen[i].show();
  }

  let nextn = [];
    for (let i = 0; i < n; i++)
      nextn[i] = tentaclen[i].par;
  for (let i = 0; i < n; i++)
   while (nextn[i]) {
    nextn[i].follow();
    nextn[i].update();
    nextn[i].show();
    nextn[i] = nextn[i].par;
  } 
}





