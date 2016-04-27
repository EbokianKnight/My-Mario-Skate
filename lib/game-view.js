var GameView = function (game, ctx, size, mobile) {
  this._game = game;
  this._ctx = ctx;
  this.keysDown = {};
  this.running = false;
  this.playing = false;
  this.throttle = false;
  this.initialize = false;
  this.gameState = ""; //("won", "lost")
  this.size = size;
  this.mobile = mobile;
  this.velMod = 1;
  this.setupDOM();
};

GameView.prototype.setupDOM = function () {
  if (this.mobile) {
    document.getElementById("main").addEventListener("click", this.togglePlay.bind(this));
  }
  this.modal = document.getElementById("start");
  this.won = document.getElementById("won");
  this.lost = document.getElementById("lost");
  this.button = document.getElementById('play');
  document.getElementById('logo').width = this.size * 50;
  this.button.width = this.size * 15;
  this.won.width = this.lost.width = this.size * 15;
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

      mario.walk(that.keysDown, this.velMod);
    } else {
      mario.someFriction();
    }

    that.checkForGameOver();
    this.animationID = window.requestAnimationFrame(animation);
  };

  animation();
};

GameView.prototype.checkForGameOver = function () {
  if (this._game.isGameOver()) {
    if (this._game.winner()) {
      this.gameState = "won";
      this.won.style.display = "block";
      this.lost.style.display = "none";
    } else {
      this.gameState = "lost";
      this.won.style.display = "none";
      this.lost.style.display = "block";
    }
    this.running = false;
    this.playing = false;
    window.cancelAnimationFrame(this.animationID);

    this.loadNewGameModal();
  }
};

GameView.prototype.togglePlay = function () {
  var pauseScreen = document.getElementById("instructions");
  var words = document.getElementById("pause");
  words.width = this.size * 65;
  words.height = this.size * 65;
  if (this.playing === false && this.running) {
    this.playing = true;
    this.start();
    this._game.timer.unpauseTimer();
    pauseScreen.style.display = "none";
  } else if (this.playing === true && this.running) {
    this.playing = false;
    pauseScreen.style.display = "flex";
    this._game.timer.pauseTimer();
  } else if (this.mobile) {
    this.startGame();
  }
};

GameView.prototype.loadNewGameModal = function () {
  this.modal.style.display = "flex";
  if (!this.mobile) {
    var fnID = this.button.addEventListener("click", this.startGame.bind(this, fnID));
  }
};

GameView.prototype.startGame = function (fnID) {
  this.button.removeEventListener("click", fnID);
  this.modal.style.display = "none";
  this.initialize = true;
  this.gameState = "";
  this._game.restart();
  console.log(this._game);
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
  this.orient = window.addEventListener('deviceorientation',
  function(event){
    var minTilt = 4;
    var moreTilt = 8;
    var mostTilt = 15;
    var minVel = 2;
    var moreVel = 3;
    var mostVel = 4;
    if (event.beta > minTilt && event.gamma > minTilt) { //down right
      that.keysDown.up = false;
      that.keysDown.right = true;
      that.keysDown.down = true;
      that.keysDown.left = false;
      if (event.beta > moreTilt && event.gamma > moreTilt) {
        this.velMod = moreVel;
      } else if (event.beta > mostTilt && event.gamma > mostTilt) {
        this.velMod = mostVel;
      } else {
        this.velMod = minVel;
      }
    } else if (event.beta > minTilt && event.gamma < -minTilt) {//down left
      that.keysDown.up = false;
      that.keysDown.right = false;
      that.keysDown.down = true;
      that.keysDown.left = true;
      if (event.beta > moreTilt && event.gamma > -moreTilt) {
        this.velMod = moreVel;
      } else if (event.beta > mostTilt && event.gamma > -mostTilt) {
        this.velMod = mostVel;
      } else {
        this.velMod = minVel;
      }
    } else if (event.beta > minTilt) { //down
      that.keysDown.up = false;
      that.keysDown.right = false;
      that.keysDown.down = true;
      that.keysDown.left = false;
      if (event.beta > moreTilt) {
        this.velMod = moreVel;
      } else if (event.beta > mostTilt) {
        this.velMod = mostVel;
      } else {
        this.velMod = minVel;
      }
    } else if (event.beta < -minTilt && event.gamma > minTilt) { //up right
      that.keysDown.up = true;
      that.keysDown.right = true;
      that.keysDown.down = false;
      that.keysDown.left = false;
      if (event.beta < -moreTilt && event.gamma > moreTilt) {
        this.velMod = moreVel;
      } else if (event.beta < -mostTilt && event.gamma > mostTilt) {
        this.velMod = mostVel;
      } else {
        this.velMod = minVel;
      }
    } else if (event.beta < -minTilt && event.gamma < -minTilt) { //up left
      that.keysDown.up = true;
      that.keysDown.right = false;
      that.keysDown.down = false;
      that.keysDown.left = true;
      if (event.beta < -moreTilt && event.gamma < -moreTilt) {
        this.velMod = moreVel;
      } else if (event.beta < -mostTilt && event.gamma < -mostTilt) {
        this.velMod = mostVel;
      } else {
        this.velMod = minVel;
      }
    } else if (event.beta < -minTilt) { // up
      that.keysDown.up = true;
      that.keysDown.right = false;
      that.keysDown.down = false;
      that.keysDown.left = false;
      if (event.beta < -moreTilt) {
        this.velMod = moreVel;
      } else if (event.beta < -mostTilt) {
        this.velMod = mostVel;
      } else {
        this.velMod = minVel;
      }
    } else if (event.gamma > -minTilt && event.gamma < minTilt && event.beta > -minTilt && event.beta < minTilt){ //middle-ish
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
