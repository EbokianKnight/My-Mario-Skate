var Util = require('./utils');
var MovingObject = require ('./moving-object');

function Coin(coord, size) {
  options = { position: coord };
  options.color = "#d6b52d";
  options.radius = size * 2;
  options.velocity = {x:0, y:0};
  MovingObject.call(this, options);
  this.frame = 1;
}

Util.inherit(Coin, MovingObject);

Coin.prototype.ticksPerFrame = function () {
  if (this.ticks <= 1) {
    this.ticks++;
  } else {
    this.ticks = 0;
    this.nextFrame();
  }
};

Coin.prototype.nextFrame = function () {
  if (this.frame++ >= 9) {
    this.callback();
  } else {
    this.frame = this.frame++;
  }
};

Coin.prototype.spin = function (callback) {
  this.collected = true;
  this.callback = callback;
};

Coin.prototype.draw = function (ctx) {
  var offset = 0;
  if (this.collected) {
    this.ticksPerFrame();
    offset = this.frame * 44;
  }
  ctx.drawImage(
    document.getElementById('coin'), // sprite
    0 + offset, // offset x
    0, // offset y
    44, // frameWidth
    40, // frameHeight
    this.position.x - (this.radius / 2), // draw at x
    this.position.y - (this.radius / 2), // draw at y
    this.radius, // actualWidth
    this.radius // actualHeight
  );
};

module.exports = Coin;
