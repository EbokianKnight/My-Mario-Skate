var GameView = function (game, ctx, size) {
  this._game = game;
  this._ctx = ctx;
  this.keysDown = {};
  this.running = false;
  this.playing = false;
  this.throttle = false;
  this.initialize = false;
  this.gameState = ""; //("won", "lost")
  this.size = size;
  this.createModal();
};

var KEYCODES = {
  w: 87,
  up: 38,
  a: 65,
  left: 37,
  d: 68,
  right: 39,
  s: 83,
  down: 40,
  space: 32,
};

// 87 / 38 up
// 65 / 37 left
// 68 / 39 right
// 83 / 40 down
// 32 space

// kicks off the animation frames
GameView.prototype.start = function () {
  var that = this;

  if (!this.initialize) {
    this.loadNewGameModal();
  } else {
    this.playing = true;
    this.running = true;
  }

  var animation = function () {
    if (that.playing === false || that.running === false) return;
    that._game.createShells();
    that._game.step();
    that._game.draw(that._ctx);
    that._game.score.draw();
    that._game.timer.draw();

    var mario = that._game.mario;

    if (that.keysDown.up === true || that.keysDown.left === true ||
        that.keysDown.right === true || that.keysDown.down === true ) {

      mario.walk(that.keysDown);
    } else {
      mario.someFriction();
    }

    that.checkForGameOver();
    window.requestAnimationFrame(animation);
  };

  animation();
};

GameView.prototype.createModal = function () {
  var modal = document.createElement("div");
  var logo = document.createElement("img");
  var button = document.createElement("img");
  var won = document.createElement("img");
  var lost = document.createElement("img");
  modal.classList.add("new-game-modal");
  modal.classList.add("content");
  logo.src = "./assets/images/MarioLogo.svg";
  logo.width = this.size * 50;
  button.src = "./assets/images/MarioPlay.svg";
  button.width = this.size * 15;
  won.src = "./assets/images/thumbsup.png";
  lost.src = "./assets/images/gameover.png";
  won.width = lost.width = this.size * 15;

  this.logo = logo;
  this.button = button;
  this.modal = modal;
  this.won = won;
  this.lost = lost;
};

GameView.prototype.checkForGameOver = function () {
  if (this._game.isGameOver()) {
    if (this._game.winner()) {
      this.gameState = "won";
    } else {
      this.gameState = "lost";
    }
    this.running = false;
    this.playing = false;
    this.initialize = false;

    this.loadNewGameModal();
  }
};

GameView.prototype.togglePlay = function () {
  if (this.playing === false) {
    this.playing = true;
    this.start();
    this._game.timer.unpauseTimer();
  } else {
    this.playing = false;
    this._game.timer.pauseTimer();
  }
};

GameView.prototype.loadNewGameModal = function () {
  var main = document.getElementById("main");
  main.appendChild(this.modal);
  this.modal.appendChild(this.logo);
  if (this.gameState === "won") {
    this.modal.appendChild(this.won);
  } else if (this.gameState === "lost") {
    this.modal.appendChild(this.lost);
  }
  this.modal.appendChild(this.button);
  this.button.addEventListener("click", this.startGame.bind(this));
};

GameView.prototype.startGame = function () {
  this.initialize = true;
  if (this.gameState === "win") {
    this.modal.removeChild(this.won);
  } else if (this.gameState === "lose") {
    this.modal.removeChild(this.lost);
  }
  this.gameState = "";
  this._game.restart();
  if (Array.prototype.indexOf.call(main.childNodes, this.modal)) {
    main.removeChild(this.modal);
  }
  this.button.removeEventListener("click", this.startGame);
  this.start();
};

GameView.prototype.checkKey = function (e) {
  if (e.keyCode === KEYCODES.space && this.running) {
    this.togglePlay();
    e.preventDefault();
  } else if (e.keyCode === KEYCODES.space && !this.running) {
    this.startGame();
    e.preventDefault();
  }
};

// private method to translate keycodes into switch directions
function readDir (keyCode) {
  if (keyCode === KEYCODES.w || keyCode === KEYCODES.up) {
    return "up";
  } else if (keyCode === KEYCODES.s || keyCode === KEYCODES.down) {
    return "down";
  } else if (keyCode === KEYCODES.d || keyCode === KEYCODES.right) {
    return "right";
  } else if (keyCode === KEYCODES.a || keyCode === KEYCODES.left) {
    return "left";
  }
}

// loads key bindings used for the game
GameView.prototype.bindKeyHandlers = function () {
  var that = this;

  this.keydown = window.addEventListener("keydown", function(event) {
    var dir = readDir(event.keyCode);
    switch (dir) {
      case "up":
        that.keysDown.up = true;
        event.preventDefault();
        break;
      case "down":
        that.keysDown.down = true;
        event.preventDefault();
        break;
      case "right":
        that.keysDown.right = true;
        event.preventDefault();
        break;
      case "left":
        that.keysDown.left = true;
        event.preventDefault();
        break;
    }
  });

  this.keypress = window.addEventListener("keypress", this.checkKey.bind(this));

  // orientation detection for phone tilt control
  this.orient = window.addEventListener('deviceorientation', function(event){
    if (event.gamma > 20 && event.beta > 20) { //up right
      that.keysDown.up = false;
      that.keysDown.right = true;
      that.keysDown.down = true;
      that.keysDown.left = false;
    } else if (event.gamma > 20 && event.beta < -20) { // up left
      that.keysDown.up = false;
      that.keysDown.right = false;
      that.keysDown.down = true;
      that.keysDown.left = true;
    } else if (event.gamma > 20) { //up
      that.keysDown.up = false;
      that.keysDown.right = false;
      that.keysDown.down = true;
      that.keysDown.left = false;
    } else if (event.gamma < -20 && event.beta > 20) { //down right
      that.keysDown.up = true;
      that.keysDown.right = true;
      that.keysDown.down = false;
      that.keysDown.left = false;
    } else if (event.gamma < -20 && event.beta < -20) { //down left
      that.keysDown.up = true;
      that.keysDown.right = false;
      that.keysDown.down = false;
      that.keysDown.left = true;
    } else if (event.gamma < -20) { // down
      that.keysDown.up = true;
      that.keysDown.right = false;
      that.keysDown.down = false;
      that.keysDown.left = false;
    } else if (event.gamma > -20 && event.gamma < 20 && event.beta > -20 && event.beta < 20){ //middle-ish
      that.keysDown.up = false;
      that.keysDown.right = false;
      that.keysDown.down = false;
      that.keysDown.left = false;
    }
  });

  this.keyup = window.addEventListener("keyup", function(event) {
    var dir = readDir(event.keyCode);
    switch (dir) {
      case "up":
        that.keysDown.up = false;
        event.preventDefault();
        break;
      case "down":
        that.keysDown.down = false;
        event.preventDefault();
        break;
      case "right":
        that.keysDown.right = false;
        event.preventDefault();
        break;
      case "left":
        that.keysDown.left = false;
        event.preventDefault();
        break;
    }
  });
};

module.exports = GameView;
