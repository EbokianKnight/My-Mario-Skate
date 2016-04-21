var GameView = function (game, ctx) {
  this._game = game;
  this._ctx = ctx;
  this.keysDown = {};
};

var KEYCODES = {
  w: 87,
  up: 38,
  a: 65,
  left: 37,
  d: 68,
  right: 39,
  s: 83,
  down: 40
};

// 87 / 38 up
// 65 / 37 left
// 68 / 39 right
// 83 / 40 down

// kicks off the animation frames
GameView.prototype.start = function () {
  var that = this;

  var animation = function () {
    that._game.createShells();
    that._game.step();
    that._game.draw(that._ctx);

    var mario = that._game.mario;

    if (that.keysDown.up === true || that.keysDown.left === true ||
        that.keysDown.right === true || that.keysDown.down === true ) {

      mario.walk(that.keysDown);
    } 
    window.requestAnimationFrame(animation);
  };

  animation();
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

  window.addEventListener("keydown", function(event) {
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

  window.addEventListener("keyup", function(event) {
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
