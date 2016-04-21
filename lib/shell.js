var Util = require('./utils');
var MovingObject = require ('./moving-object');

var SHELL_SPEED = 3;

function Shell(options, size) {
  options.color = options.color || '#2f5c23';
  options.radius = size/2;
  options.velocity = options.velocity ||
    Util.randomVec(SHELL_SPEED);

  MovingObject.call(this, options);
}

Util.inherit(Shell, MovingObject);

// SO LAGGY
// Shell.prototype.draw = function (ctx) {
//   ctx.drawImage(
//     document.getElementById('green'), // sprite
//     this.position.x - this.radius, // draw at x
//     this.position.y - this.radius, // draw at y
//     this.radius * 2, // frameWidth
//     this.radius * 2 // frameHeight
//   );
// };

module.exports = Shell;
