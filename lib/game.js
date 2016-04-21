var Shell = require('./shell');
var Mario = require('./mario');
var Coin = require('./coin');

var DIMX, DIMY, SPACER;

var shells = [];
var coins = [];

var Game = function (ctx2, width, height, spacer) {
  DIMX = width;
  DIMY = height;
  SPACER = spacer;
  this.mario = new Mario({ x: DIMX / 2, y: DIMY / 2 }, SPACER);
  this.scatterCoins(ctx2);
  this.score = 0;
  this.collected = [];
};

// sorts created objects into the correct private arrays
Game.prototype.addObject = function(obj) {
  if (obj instanceof Shell) { shells.push(obj); }
  if (obj instanceof Coin) { coins.push(obj); }
};

// creates and loads all the objects in the game
Game.prototype.createShells = function () {
  var numShells = 5 + Math.floor(this.score / 10);
  if (numShells <= shells.length) { return; }
  this.addObject(new Shell({
    position: this.randomPosition()
  },SPACER));
};

Game.prototype.scatterCoins = function (ctx2) {
  coins = [];
  var spacer = SPACER * 3;
  var xTotal = Math.floor(DIMX / spacer);
  var yTotal = Math.floor(DIMY / spacer);
  for (var x = 0; x < xTotal; x++) {
    for (var y = 0; y < yTotal; y++) {
      var coin = new Coin({
        x:((x * spacer) + SPACER*2),
        y:((y * spacer) + SPACER*2)
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
    // if (obj.isWrappable) {
      obj.move(wrap);
    // } else {
    //   obj.move(removeIfWrapping(obj).bind(this));
    // }
  }
};

Game.prototype.remove = function (obj) {
  var index;
  if (obj instanceof Shell) {
    index = shells.indexOf(obj);
    shells.splice(index, 1);
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
      shells = [];
      this.scatterCoins();
      this.score = 0;
      this.mario.relocate();
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
  this.score++;
};

// moves objects and checks to see if any of hit a collision trigger
Game.prototype.step = function () {
  this.moveObjects();
  this.checkCollisions();
};

// spawns shells on the right and left boundies of the map
Game.prototype.randomPosition = function () {
  return { x: 0, y: Math.random() * DIMY };
};

function isWrapping(position) {
  return position.x < 0 || position.y < 0 ||
    position.x > DIMX || position.y > DIMY;
}

// to be used by objects that are removed once they leave the field
function removeIfWrapping(bullet) {
  return function() {
    // if (isWrapping(bullet.position)) {
    //   this.remove(bullet);
    // }
  };
}

function wrap(position) {
  position.x = position.x < 0 ? DIMX : position.x;
  position.y = position.y < 0 ? DIMY : position.y;
  position.x = position.x > DIMX ? 0 : position.x;
  position.y = position.y > DIMY ? 0 : position.y;
}

module.exports = Game;
