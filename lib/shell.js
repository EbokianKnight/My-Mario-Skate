var Util = require('./utils');
var MovingObject = require ('./moving-object');

function Shell(options, size) {
  options.color = options.color || '#2f5c23';
  options.radius = size * 1.8;
  MovingObject.call(this, options);
  this.ticks = 0;
  this.frame = 0;
  this.ghost = true;
  window.setTimeout(function(){
    this.ghost = false;
  }.bind(this),800);
}

Util.inherit(Shell, MovingObject);

Shell.prototype.ticksPerFrame = function () {
  if (this.ticks <= 5) {
    this.ticks++;
  } else {
    this.ticks = 0;
    this.nextFrame();
  }
};

Shell.prototype.nextFrame = function () {
  if (this.frame++ >= 5) {
    this.frame = 0;
  } else {
    this.frame = this.frame++;
  }
};

Shell.prototype.draw = function (ctx) {
  this.ticksPerFrame();
  var offset = this.frame * 40;
  if (this.ghost) {
    ctx.save();
    ctx.globalAlpha = 0.4;
  } else {
    ctx.drawImage(
      document.getElementById('green-reflect'), // sprite
      0 + offset, // offset x
      0, // offset y
      40, // frameWidth
      40, // frameHeight
      this.position.x - (this.radius), // draw at x
      this.position.y + (this.radius * 0.2), // draw at y
      this.radius * 2, // actualWidth
      this.radius * 2 // actualHeight
    );
  }
  ctx.drawImage(
    document.getElementById('green'), // sprite
    0 + offset, // offset x
    0, // offset y
    40, // frameWidth
    40, // frameHeight
    this.position.x - (this.radius), // draw at x
    this.position.y - (this.radius), // draw at y
    this.radius * 2, // actualWidth
    this.radius * 2 // actualHeight
  );
  if (this.ghost) {
    ctx.restore();
  }
};

module.exports = Shell;
