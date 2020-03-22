class Boid{
constructor(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
  this.dvnval=0;
}



run = function(boids) {
  let mouse = new p5.Vector(mouseX,mouseY);

  if(atarget.checked())
  this.seekt();
  
  this.flock(boids);

  if(avoid.checked())
    this.avoido();
  this.update();

  this.borders();
  this.render();
}

applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
  
}

// Method to update location
update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
  
}

seekt = function() {
  let mouse = new p5.Vector(mouseX,mouseY);
  let desired = new p5.Vector.sub(mouse,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  let dd = desired.mag();
    // Scale with arbitrary damping within 100 pixels
    if (dd < 100) {
      let m = map(dd,0,100,0,this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }

  // Steering = Desired minus Velocity

  let steer = new p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  this.applyForce(steer);
}

avoido = function(boids){

  let mouse = new p5.Vector(mouseX,mouseY);
  if(mouse.dist(this.position)>20)
  {
    return;
  }
  let desired = p5.Vector.sub(mouse,this.position);  // A vector pointing from the location to the target
  
  let dd = desired.mag();
    // Scale with arbitrary damping within 100 pixels
    if (dd < 100) {
      let m = map(dd,0,100,0,this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }


  desired.mult(-1);
  
  let a = random(0,2)
  if(parseInt(a))
    var r = new p5.Vector(-desired.y,desired.x);
  else
    var r = new p5.Vector(desired.y,-desired.x);

  r.normalize();
  let steer = new p5.Vector.sub(desired,r);
  let steer1 = new p5.Vector.sub(steer,this.velocity);
  steer1.add(this.maxforce);  // Limit to maximum steering force
  //this.acceleration.mult(0);
  /*let te = degrees(steer.heading());
  te*=20;
  let temp = p5.Vector.fromAngle(te,steer.mag());
  */
  //steer.mult(this.maxspeed);
  this.applyForce(steer1);
  //console.log(degrees(steer.heading()));
  }


render = function() {
  // Draw a triangle rotated in the direction of velocity
  let theta = this.velocity.heading() + radians(90);
  fill(127);
  stroke(200);
  push();
  translate(this.position.x, this.position.y);
  rotate(theta);
  beginShape();
  if(Boid.dvnval){  
    noFill();
    //arc(0,0,50,50,PI,0,CHORD);
    ellipse(0,0,50,50);
  }
  fill(127);
  vertex(0, -this.r * 2);
  vertex(-this.r, this.r * 2);
  vertex(this.r, this.r * 2);
  endShape(CLOSE);
  pop();
}

// Wraparound
borders = function() {
  /*if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
  */
    let desired = new p5.Vector(0,0) ;
    let f=0;

    if (this.position.x < d) {
      desired = new p5.Vector(this.maxspeed, this.velocity.y);f=1;
    } 
    else if (this.position.x > width -d) {
      desired = new p5.Vector(-this.maxspeed, this.velocity.y);f=1;
    } 

    if (this.position.y < d) {
      desired = new p5.Vector(this.velocity.x, this.maxspeed);f=1;
    } 
    else if (this.position.y > height-d) {
      desired = new p5.Vector(this.velocity.x, -this.maxspeed);f=1;
    } 

    if (f==1) {
      desired.normalize();
      //desired.mult(this.maxspeed);
      let steer1 = new p5.Vector.sub(desired, this.velocity);
      //steer1.limit(maxforce);
      this.applyForce(steer1);
    } 

}


// Separation
// Method checks for nearby boids and steers away
separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
align = function(boids) {
  let neighbordist = 25;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
cohesion = function(boids) {
  let neighbordist = 100;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}
}


