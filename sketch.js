var population;
var lifespan=250;
var lifeP;
var count =0;
var target;
var rx1 =100;
var ry1 =250;
var rw1 = 200;
var rh1 =10;
var maxforce =0.5;
var Generation=1;
var GenP;
var MaxP;
function setup()
{
  createCanvas(400,500);
  rocket = new Rocket();
  population = new Population();
  lifeP=createP();
  GenP = createP();
  //MaxP =createP();
  target = createVector(width/2,50);
}

function draw()
{
  background(0);
  population.run();
  lifeP.html("Frames:" + count);
  GenP.html("Generation :"+ Generation);
  //MaxP.html("Max Fitness:" + maxfit);
  count++;
  if(count==lifespan)
    {
      Generation++;
      population.evaluate();
      population.selection();
      
      //population =new Population();
      count=0;
    }
  fill(255);
  rect(rx1,ry1,rw1,rh1);
  fill('red');
  ellipse(target.x,target.y,16,16);

}
function Population(){
  this.rockets = [];
  this.popsize = 25;
  this.matingpool=[];
  
  for(var i=0;i< this.popsize;i++)
    {
      this.rockets[i]=new Rocket();
    }
  this.evaluate = function()
  {
     var maxfit=0;
      for(var i=0;i<this.popsize;i++){
        this.rockets[i].calcFitness();
        if(this.rockets[i].fitness > maxfit)
          {
            maxfit = this.rockets[i].fitness; 
          }
      }
      console.log(this.rockets);
     // createP(maxfit);
      for(var i=0;i<this.popsize;i++){
        this.rockets[i].fitness /=maxfit; 
      }
    this.matingpool=[];
    for(var i=0;i<this.popsize;i++){
        var n= this.rockets[i].fitness*100; 
      for(var j=0;j<n;j++){
          this.matingpool.push(this.rockets[i]);
        }
      }
  }
   this.selection = function(){
     var newRockets =[];
     for(var i=0;i< this.rockets.length ;i++){
     var parentA = random(this.matingpool).dna;
     var parentB = random(this.matingpool).dna;
     var child = parentA.crossover(parentB);
       child.mutation();
      newRockets[i] = new Rocket(child); 
     } 
     this.rockets = newRockets;
   }
  
   this.run = function(){
     for(var i=0;i<this.popsize;i++)
      {
      this.rockets[i].update();
      this.rockets[i].show();
      }
   } 
    
}
function DNA(genes)
{
  if(genes){
    this.genes = genes;
  }
   else{
  this.genes =[];
  for(var i=0;i<lifespan;i++){
    this.genes[i] = p5.Vector.random2D();
    this.genes[i].setMag(maxforce);
  }
  }
  this.crossover = function(partner){
    var newgenes = [];
    var mid = floor(random(this.genes.length));
    for(var i=0;i<this.genes.length;i++)
      {
        if(i>mid)
          {
            newgenes[i] = this.genes[i];
          }
        else
          {
            newgenes[i] = partner.genes[i];
          }
        
      }
    return new DNA(newgenes);
    
  }
  
  this.mutation = function(){
     for(var i=0; i<this.genes.length ;i++)
       {
          if(random(1)< 0.01)
            {
              this.genes[i] = p5.Vector.random2D();
              this.genes[i].setMag(maxforce);
            }
       }
  }
} 
function Rocket(dna)
{
  this.pos = createVector(width/2 , height);
  this.vel = createVector();
  this.acc = createVector();
  this.completed = false;
  this.crashed =false;
  //this.minD=100000000;
  
  if(dna)
    {
      this.dna = dna;
    }
  else{
  this.dna = new DNA();
    }
  this.fitness=0;
 // this.count=0;
  
  this.applyForce = function(force){
    this.acc.add(force);
  }
  
  this.calcFitness = function(){
    var d = dist(this.pos.x,this.pos.y,target.x,target.y); 
    this.fitness = map(d,0,width,width,0);
    if(this.completed)
      {
        this.fitness *=10;
      }
    if(this.crashed)
      {
        this.fitness /= 10;
       
      }
     this.fitness /= count;
  }
  
  this.update = function(){
    
    var d = dist(this.pos.x,this.pos.y,target.x,target.y);
  /*  if(this.minD<d)
      {
        this.minD=d;
      }
    else if(this.minD>d && this.minD!=100000000)
      {
        this.fitness/=100;
      }*/
    if(d<10)
      {
        this.completed=true;
        this.pos = target.copy();
      }
    if(this.pos.x > rx1+5 && this.pos.x < rx1 + rw1-5  && this.pos.y > ry1 && this.pos.y <ry1 +rh1){
      this.crashed=true ;
    }
    
    if(this.pos.x > width || this.pos.x<0)
      {
        this.crashed = true;
      }
    if(this.pos.y > height || this.pos.y<0)
      {
        this.crashed = true;
      }
    this.applyForce(this.dna.genes[count]);
   // this.count++; 
    if(!this.completed && !this.crashed){
         this.vel.add(this.acc);
         this.pos.add(this.vel);
         this.acc.mult(0);
         this.vel.limit(4);
    }
  }
  
  this.show = function(){
     push();
     noStroke();
     
     translate(this.pos.x,this.pos.y);
     rotate(this.vel.heading());
     rectMode(CENTER);
     fill('silver');
     rect(0,0,25,6);
     fill(random(255),random(255),random(255));
     triangle(0,-5,25,0,0,5);
     pop();    
  }
  
}
