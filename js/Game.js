class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = true;
    this.leftKeyActive = false;
    this.turno = 0;
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    apagador= createSprite(50, 500,20,20);

    mano1 = createSprite(width / 2 - 50, 1500,20,20);
    mano1.addImage("mano1", mano1_img);
    mano1.scale = 0.4;

    mano2 = createSprite(width / 2 + 100, -1500,20,20);
    mano2.addImage("mano2", mano2_img);
    mano2.scale = 0.4;

    manos=[mano1,mano2];

    
    

    palitos = new Group();

    var palitosPositions = [
      { x: 540, y: height/2, image: palitosImage},
      { x: 620, y: height/2, image: palitosImage},
      { x: 700, y: height/2, image: palitosImage},
      { x: 780, y: height/2, image: palitosImage},
      { x: 860, y: height/2, image: palitosImage},
      { x: 940, y: height/2, image: palitosImage},
      { x: 1020, y: height/2, image: palitosImage},
      { x: 1100, y: height/2, image: palitosImage},
      { x: 1180, y: height/2, image: palitosImage},
      { x: 1260, y: height/2, image: palitosImage},
      { x: 1340, y: height/2, image: palitosImage},
    ];



    //Agregar sprite de obstáculos al juego
    this.addSprites(
      palitos,
      palitosPositions.length,
      palitosImage,
      1,
      palitosPositions,
      10
    );
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = [], size,) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //C41 //SA
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      sprite.diameter = size;
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reiniciar juego");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();


    if (allPlayers !== undefined) {
      image(backgroundInGame, 400, 0, width/1.7, height);

      this.showLeaderboard();
      //apagador.onclick= function(){this.turno = 1};
      //this.handleTurno();
      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //Agrega 1 al índice por cada bucle
        index = index + 1;

        //utiliza datos de la base de datos para mostrar los autos en las direcciones x e y
        var x = allPlayers[plr].positionX;
        var y = allPlayers[plr].positionY;

        mano1.position.x = x;
        mano1.position.y = y;
        
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 20, 20);
          this.handlePalitos(index);
            }
          }
      


      // manejar eventos teclado
      this.handlePlayerControls();

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
    });
  }


  handlePalitos(index){
    manos[index - 1].overlap(palitos, function(collector, collected) {
      player.update();
      collected.remove();
    });
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Esta etiqueta se utiliza para mostrar cuatro espacios
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if(this.playerMoving){
    if (keyDown(LEFT_ARROW)) {
      player.positionY = mouseY;
      player.positionX = mouseX;
      player.update();
  }}}



  handleTurno(index) {
    if (index === player.index){
    if (this.turno === 0) {
      this.playerMoving = true;
    player.update();}
      else{
        this.playerMoving = false;
        player.update();
      }
      
    }
  }



  showRank() {
    swal({
      title: `¡Impresionante!${"\n"}Posición${"\n"}${player.rank}`,
      text: "Llegaste a la meta con éxito",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Fin del juego`,
      text: "¡Ups perdiste la carrera!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Gracias por jugar"
    });
  }
}
