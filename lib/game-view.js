var GameView = function (game, ctx) {
  this._game = game;
  this._ctx = ctx;
  this.keysDown = {};
  this.running = false;
  this.playing = false;
  this.throttle = false;
  this.initialize = false;
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
  var logo = document.createElement("div");
  var button = document.createElement("div");
  modal.classList.add("new-game-modal");
  logo.classList.add("game-logo");
  button.classList.add("game-button");
  this.logo = logo;
  this.button = button;
  this.modal = modal;
};

GameView.prototype.checkForGameOver = function () {
  if (this._game.isGameOver()) {
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
  this._game.restart();
  var main = document.getElementById("main");
  main.appendChild(this.modal);
  this.modal.appendChild(this.logo);
  this.modal.appendChild(this.button);
  this.button.addEventListener("click", this.startGame.bind(this));
};

GameView.prototype.startGame = function () {
  this.initialize = true;
  var main = document.getElementById("main");
  this.modal.removeChild(this.modal.firstChild);
  this.modal.removeChild(this.modal.firstChild);
  main.removeChild(this.modal);
  this.button.removeEventListener("click", this.startGame.bind(this));
  this.start();
};

GameView.prototype.throttlePausePlay = function () {
  if (!this.stopped) {
    this.togglePlay();
    this.stopped = true;
    window.setTimeout(this.unstop.bind(this), 600);
  }
};

GameView.prototype.unstop = function () {
  this.stopped = false;
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
  } else if (keyCode === KEYCODES.space) {
    return "space";
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
      case "space":
        that.throttlePausePlay();
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
