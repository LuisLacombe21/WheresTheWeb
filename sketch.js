let tSize = 300;
let tposX, tposY;
let pointCount = 1;
let speed = 10, comebackSpeed = 10, dia = 1;
let randomPos = true;
let interactionDirection = -5;

let textPoints = [];
let words = [
  { text: "Drums", url: "https://www.patatap.com/" },
  { text: "References", url: "https://brutalistwebsites.com/" },
  { text: "Imaginary radio ", url: "https://soundcloud.com/vvvirgilabloh/sets/imaginaryradio" }
];
let currentWordIndex = 0;
let colors = ['#ff5733', '#33ff57', '#3357ff', '#f0e130'];
let font;

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);

  // Centrar y crear puntos de texto inicial
  updateTextPosition();
  createTextPoints();
}

function draw() {
  background(10);

  // Mostrar las partículas de texto
  textPoints.forEach(point => {
    point.update();
    point.show();
    point.behaviors();
  });
}

function mousePressed() {
  // Verificar si se hizo clic en una partícula
  textPoints.forEach(point => {
    if (dist(mouseX, mouseY, point.pos.x, point.pos.y) < point.r) {
      window.open(words[currentWordIndex].url, "_blank"); // Abrir URL
      currentWordIndex = (currentWordIndex + 1) % words.length; // Cambiar palabra
      createTextPoints(); // Crear nuevos puntos para la nueva palabra
    }
  });
}

function createTextPoints() {
  textPoints = [];
  let points = font.textToPoints(words[currentWordIndex].text, tposX, tposY, tSize, { sampleFactor: pointCount });
  points.forEach(pt => {
    textPoints.push(new Interact(pt.x, pt.y));
  });
}

function updateTextPosition() {
  tposX = width / 2 - (tSize * 2); // Ajustar para centrar el texto
  tposY = height / 2;
  tSize = min(width, height) * 0.2;
}

class Interact {
  constructor(x, y) {
    this.pos = randomPos ? createVector(random(width), random(height)) : createVector(x, y);
    this.target = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.r = 8;
    this.maxSpeed = speed;
    this.come = comebackSpeed;
    this.dia = dia;
    this.dir = interactionDirection;
    this.color = random(colors);
  }

  behaviors() {
    this.applyForce(this.arrive(this.target));
    this.applyForce(this.flee(createVector(mouseX, mouseY)));
  }

  applyForce(force) {
    this.acc.add(force);
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    desired.setMag(d < this.come ? map(d, 0, this.come, 0, this.maxSpeed) : this.maxSpeed);
    return p5.Vector.sub(desired, this.vel);
  }

  flee(target) {
    let desired = p5.Vector.sub(target, this.pos);
    if (desired.mag() < this.dia) {
      desired.setMag(this.maxSpeed).mult(this.dir);
      return p5.Vector.sub(desired, this.vel).limit(0.1);
    }
    return createVector(0, 0);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateTextPosition();
  createTextPoints();
}

