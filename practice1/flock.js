class Flock {
	constructor(){
  // An array for all the boids
  this.boids = []; // Initialize the array
  	}
  	
run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

addBoid = function(b) {
  this.boids.push(b);
  ++bcount;
}
}