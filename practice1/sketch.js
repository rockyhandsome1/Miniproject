
let flock;
var d=10;
let debugv;
let wall;
let walls;
let atarget;
let avoid;
let bcount=0;
let rad = 180;

function setup() {
  createCanvas(640, 360);

  createP("click mouse at the center to generate new boids.");
  debugv = createCheckbox('Boid_vision',false);
  debugv.changed(debugvision);
  wall = createCheckbox('Wall',false);
  walls = createSlider(10,140,10);
  atarget = createCheckbox('Activate_target_(mouse)',false);
  avoid = createCheckbox('avoid_obstacle_(mouse)',false);
  //wall.changed(dispwall);
 
  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 1; i++) {
    let b = new Boid(width / 2,height / 2);
    flock.addBoid(b);
  }
}

function draw() {
  d=walls.value();
  background(51);
  fill(50);
  text('Boid count:'+bcount,10,30);
  if(avoid.checked())
  fill(255,0,0);
  ellipse(mouseX,mouseY,20,20);
  fill(170);
  ellipse(mouseX,mouseY,10,10);
  if(wall.checked()){
    stroke(255);
    noFill();
    rectMode(CENTER);
    rect(width/2, height/2, width-d*2, height-d*2);
  }
  fill(127);
  //ellipse(width/2,height/2,360,360);
  if(dist(width/2,height/2,mouseX,mouseY)<rad) 
  if (mouseIsPressed) 
  if (mouseButton == LEFT)  
    flock.addBoid(new Boid(mouseX, mouseY));
    console.log(dist(width/2,height/2,mouseX,mouseY));
  flock.run();
}

function debugvision(){
  if(this.checked()){
    Boid.dvnval=1;
  }
  else{
    Boid.dvnval=0;
  }
}




