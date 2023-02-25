var canvas;
var backgroundImage,backgroundInGame, mano1_img, mano2_img;
var palitosImage;
var database, gameState;
var form, player, playerCount;
var allPlayers, mano1, mano2, palitos;
var manos = [];
var apagador, apagador2;

function preload() {
  backgroundImage = loadImage("../assets/background.jpg");
  mano1_img = loadImage("../assets/mano1.png");
  mano2_img = loadImage("../assets/mano2.png");
  backgroundInGame = loadImage("../assets/backgroundInGame.png");
  palitosImage = loadImage("../assets/palitosImage.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if (gameState === 2) {
    game.showLeaderboard();
    game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
