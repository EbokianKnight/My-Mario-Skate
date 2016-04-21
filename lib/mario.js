var MovingObject = require('./moving-object');
var Util = require('./utils');

var MAX_VELOCITY = 5;

function Mario(position, size) {
  MovingObject.call(this, {
    position: { x: position.x, y: position.y },
    velocity: { x: 0, y: 0 },
    color: '#f00f00',
    radius: size
  });
  this._initialPosition = position;
  this._angle = 0;
  this.ticks = 0;
  this.frame = 1;
  this.faceDir = { up:false, down:true, right:false, left:false};
  this.size = size;
  this.lives = 3;
}

Util.inherit(Mario, MovingObject);

Mario.prototype.someFriction = function () {
  var modX = 0, modY = 0;
  if (this.velocity.x > 0) {
    modX = -0.05;
  } else if (this.velocity.x < 0) {
    modX = 0.05;
  }
  if (this.velocity.y > 0) {
    modY = -0.05;
  } else if (this.velocity.y < 0) {
    modY = +0.05;
  }
  this.velocity.x += modX;
  this.velocity.y += modY;
};

Mario.prototype.reduceLives = function () {
  this.lives -= 1;
};

Mario.prototype.setLives = function (n) {
  this.lives = n || 3;
};

Mario.prototype.relocate = function() {
  this.position.x = this._initialPosition.x;
  this.position.y = this._initialPosition.y;
  this.velocity.x = 0;
  this.velocity.y = 0;
  this._angle = 0;
};

Mario.prototype.power = function (impulse) {
  var impulseX = impulse * Math.cos(this._angle);
  var impulseY = impulse * Math.sin(this._angle);
  var length = (this.velocity.x * this.velocity.x) +
    (this.velocity.y * this.velocity.y);
  if (length > MAX_VELOCITY * MAX_VELOCITY) {
    var signVX = this.velocity.x < 0;
    var signVY = this.velocity.y < 0;
    var signIX = impulseX < 0;
    var signIY = impulseY < 0;
    if (signVX ^ signIX) {
      this.velocity.x += impulseX;
    }
    if (signVY ^ signIY) {
      this.velocity.y += impulseY;
    }
  } else {
    this.velocity.x += impulseX;
    this.velocity.y += impulseY;
  }
};

Mario.prototype.walk = function (dir) {
  if (dir.up === true || dir.down === true || dir.left === true || dir.right === true) {
    this.faceDir = dir;
  }
  if (dir.up && dir.right) {
    this._angle = (315) * (Math.PI / 180.0);
  } else if (dir.up && dir.left) {
    this._angle = (225) * (Math.PI / 180.0);
  } else if (dir.up) {
    this._angle = (270) * (Math.PI / 180.0);
  } else if (dir.down && dir.right) {
    this._angle = (45) * (Math.PI / 180.0);
  } else if (dir.down && dir.left) {
    this._angle = (135) * (Math.PI / 180.0);
  } else if (dir.down) {
    this._angle = (90) * (Math.PI / 180.0);
  } else if (dir.left) {
    this._angle = (180) * (Math.PI / 180.0);
  } else if (dir.right) {
    this._angle = (360) * (Math.PI / 180.0);
  }
  this.power(0.1);
};

Mario.prototype._getFacing = function () {
  if (this.faceDir.up && this.faceDir.right) {
    return {dx:132 , dy:195};
  } else if (this.faceDir.up && this.faceDir.left) {
    return {dx:132 , dy:65};
  } else if (this.faceDir.up) {
    return {dx:0 , dy:195};
  } else if (this.faceDir.down && this.faceDir.right) {
    return {dx:132 , dy:130};
  } else if (this.faceDir.down && this.faceDir.left) {
    return {dx:132 , dy:0};
  } else if (this.faceDir.right) {
    return {dx:0 , dy:130};
  } else if (this.faceDir.left) {
    return {dx:0 , dy:65};
  } else if (this.faceDir.down) {
    return {dx:0 , dy:0};
  } else {
    return this.lastDir;
  }
};

Mario.prototype.ticksPerFrame = function () {
  var curVel = Math.abs(this.velocity.x) + Math.abs(this.velocity.y);
  if (curVel < 0.5) {
    this.tick = 0;
    this.frame = 1;
    return;
  }
  var rate = 20 - ((curVel) * 2);
  if (this.ticks <= rate) {
    this.ticks++;
  } else {
    this.ticks = 0;
    this.nextFrame();
  }
};

Mario.prototype.nextFrame = function () {
  if (this.frame++ >= 2) {
    this.frame = 0;
  } else {
    this.frame = this.frame++;
  }
};

Mario.prototype.draw = function (ctx) {
  this.ticksPerFrame();
  var facing = this._getFacing();
  this.lastDir = facing;
  var offset = this.frame * 44;

  ctx.drawImage(
    document.getElementById('mario'), // sprite
    facing.dx + offset, // offset x
    facing.dy, // offset y
    44, // frameWidth
    65, // frameHeight
    this.position.x - this.size, // draw at x
    this.position.y - this.size, // draw at y
    this.size*2, // frameWidth
    this.size*2.6 // frameHeight
  );


};

module.exports = Mario;
