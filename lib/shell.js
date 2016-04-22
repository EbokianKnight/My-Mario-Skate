var Util = require('./utils');
var MovingObject = require ('./moving-object');

function Shell(options, size) {
  options.color = options.color || '#2f5c23';
  options.radius = size*0.75;
  MovingObject.call(this, options);
}

Util.inherit(Shell, MovingObject);

Shell.prototype.draw = function (ctx) {
  ctx.drawImage(
    document.getElementById('green'), // sprite
    this.position.x - this.radius, // draw at x
    this.position.y - this.radius, // draw at y
    this.radius * 2, // frameWidth
    this.radius * 2 // frameHeight
  );
};

module.exports = Shell;
