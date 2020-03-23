
let flock;
var d=10;
let debugv;
let wall;
let walls;
let atarget;
let avoid;
let bcount=0;
let rad = 180;
let bs;
let tc;
let tentaclen = []; 
let k=1;
let b;

function setup() {
  createCanvas(640, 360);

  createP("click mouse near the center to generate new boids.");
  bs = createCheckbox('Boid_circle',false);
  debugv = createCheckbox('Boid_vision',false);
  debugv.changed(debugvision);
  wall = createCheckbox('Wall',false);
  walls = createSlider(10,140,10);
  atarget = createCheckbox('Activate_target_(mouse)',false);
  avoid = createCheckbox('avoid_obstacle_(mouse)',false);
  tc = createCheckbox('Triangle+circle',true);
    
  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 1; i++) {
    b = new Boid(width / 2,height / 2);
    flock.addBoid(b);
  }
  sett(k);
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

  //ellipse(width/2,height/2,360,360);
  if(dist(width/2,height/2,mouseX,mouseY)<rad) 
  if (mouseIsPressed) 
  if (mouseButton == LEFT)  
    flock.addBoid(new Boid(mouseX, mouseY));
    //console.log(dist(width/2,height/2,mouseX,mouseY));

  noFill();
  if(avoid.checked())
  fill(255,0,0);
  ellipse(mouseX,mouseY,20,20);
  fill(255);
  stroke(255);
  ellipse(mouseX,mouseY,10,10);
  
  flock.run();
  tentaclen[0].follow(b.position.x,b.position.y);
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
    currentn[i] = new Segment(pointn[i], 10, 0);
  let nextn = [];
  for (let j = 0; j < n; j++)
    for (let i = 0; i < 200; i++) {
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





