var Shell = require('./shell');
var Mario = require('./mario');
var Coin = require('./coin');
var Score = require('./score');
var Timer = require('./timer');
var Util = require('./utils');

var DIMX, DIMY, SPACER;

var shells = [];
var coins = [];
var destroyedShells = 0;

var Game = function (context, width, height, size) {
  DIMX = width;
  DIMY = height;
  SPACER = size;
  this.mario = new Mario({ x: DIMX / 2, y: DIMY / 2 }, SPACER);
  this.scatterCoins(context.ctx2);
  this.score = new Score(context.score, SPACER);
  this.timer = new Timer(context.timer, SPACER);
  this.collected = [];
};

Game.prototype.isGameOver = function () {
  if (this.mario.lives > 0 && coins.length > 0) {
    return false;
  } else {
    return true;
  }
};

Game.prototype.winner = function () {
  if (coins.length > 0) {
    return false;
  } else {
    return true;
  }
};

Game.prototype.killMario = function () {
  this.mario.reduceLives();
  this.mario.relocate();
};

Game.prototype.restart = function () {
  shells = [];
  destroyedShells = 0;
  this.scatterCoins();
  this.score.resetScore();
  this.timer.reset();
  this.mario.setLives();
  this.mario.relocate();
};

// sorts created objects into the correct private arrays
Game.prototype.addObject = function(obj) {
  if (obj instanceof Shell) { shells.push(obj); }
  if (obj instanceof Coin) { coins.push(obj); }
};

var SHELL_SPEED = 2;
// creates and loads all the objects in the game
Game.prototype.createShells = function () {
  if (this._numShells() <= shells.length) { return; }
  var vel = Util.randomVec(SHELL_SPEED);
  this.addObject(new Shell({
    velocity: vel,
    position: this.randomPosition(vel)
  },SPACER));
};

Game.prototype._numShells = function () {
  return 4 + Math.floor(this.score.points / 10) - destroyedShells;
};


Game.prototype.scatterCoins = function (ctx2) {
  coins = [];
  var spacer = SPACER * 7.2;
  var xTotal = Math.floor(DIMX / spacer);
  var yTotal = Math.floor(DIMY / spacer);
  for (var x = 0; x < xTotal; x++) {
    for (var y = 0; y < yTotal; y++) {
      var coin = new Coin({
        x:((x * spacer) + spacer),
        y:((y * spacer) + spacer)
      },SPACER);
      coins.push(coin);
    }
  }
};

// passes the context to each object drawing on the canvas
Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, DIMX, DIMY);
  var allObjects = this.allObjects();
  for (var i = 0; i < allObjects.length; i++) {
    allObjects[i].draw(ctx);
  }
};

// concats all the objects together to be rendered
Game.prototype.allObjects = function () {
  return coins.concat(shells, [this.mario]);
};

// applies the moving object logic on each target
Game.prototype.moveObjects = function () {
  var objects = this.allObjects();
  for (var i = 0; i < objects.length; i++) {
    var obj = objects[i];
    if (obj instanceof Coin) { continue; }
    obj.move(bounce, DIMX, DIMY);
  }
};

Game.prototype.remove = function (obj) {
  var index;
  if (obj instanceof Shell) {
    index = shells.indexOf(obj);
    shells.splice(index, 1);
    destroyedShells++;
  }
  if (obj instanceof Coin) {
    index = coins.indexOf(obj);
    coins.splice(index, 1);
  }
};

// checks each object to see if mario collided with it
Game.prototype.checkCollisions = function() {
  var i, j, current;
  for (i = 0; i < shells.length; i++) {
    current = shells[i];
    if (current.isCollidedWith(this.mario)) {
      this.remove(current);
      this.killMario();
    }
  }
  for (i = 0; i < coins.length; i++) {
    if (this.collected.includes(current)) continue;
    current = coins[i];
    if (current.isCollidedWith(this.mario)) {
      this.collected.push(current);
      current.spin(this.coinsCallback.bind(this, current));
    }
  }

};

Game.prototype.coinsCallback = function (current) {
  this.remove(current);
  this.score.updateScore(1);
};

// moves objects and checks to see if any of hit a collision trigger
Game.prototype.step = function () {
  this.moveObjects();
  this.checkCollisions();
};

// spawns shells on the right and left boundies of the map
Game.prototype.randomPosition = function (vel) {
  var randY = Math.random() * DIMY * 0.8;
  var leftRight;
  if (vel.x > 0) {
    leftRight = SPACER*6;
  } else {
    leftRight = DIMX - SPACER*6;
  }
  return { x: leftRight, y: randY + (DIMY * 0.1) };
};

function isBouncingY(position, radius) {
  radius = radius || 0;
  return (
    (position.y - radius) < 0 ||
    (position.y + radius) > DIMY
  );
}

function isBouncingX(position, radius) {
  radius = radius || 0;
  return (
    (position.x - radius) < 0 ||
    (position.x + radius) > DIMX
  );
}

function bounce(object) {
  var pos = object.position;
  var rad = object.radius;

  if (isBouncingY(pos, rad) && isBouncingX(pos, rad)) {
    if (object === this.mario) {
      object.velocity.x = object.velocity.x / 2;
      object.velocity.y = object.velocity.y / 2;
      if (pos.x < rad) {
        pos.x = rad + 1;
      } else if (pos.x > DIMX - rad) {
        pos.x = DIMX - rad - 1;
      }
      if (pos.y < rad) {
        pos.y = rad + 1;
      } else if (pos.y > DIMY - rad) {
        pos.y = DIMY - rad - 1;
      }
    }
    object.velocity.x *= -1;
    object.velocity.y *= -1;
  } else if (isBouncingY(pos, rad)) {
    if (object instanceof Mario) {
      object.velocity.x = object.velocity.x / 2;
      object.velocity.y = object.velocity.y / 2;
      if (pos.y < rad) {
        pos.y = rad + 1;
      } else if (pos.y > DIMY - rad) {
        pos.y = DIMY - rad - 1;
      }
    }
    object.velocity.y *= -1;
  } else if (isBouncingX(pos, rad)) {
    if (object instanceof Mario) {
      object.velocity.x = object.velocity.x / 2;
      object.velocity.y = object.velocity.y / 2;
    }
    if (pos.x < rad) {
      pos.x = rad + 1;
    } else if (pos.x > DIMX - rad) {
      pos.x = DIMX - rad - 1;
    }
    object.velocity.x *= -1;
  }
}

module.exports = Game;
