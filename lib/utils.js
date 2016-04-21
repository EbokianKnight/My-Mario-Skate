var Util = {};

Util.inherit = function (child, klass) {
  function Surrogate() {}
  Surrogate.prototype = klass.prototype;
  child.prototype = new Surrogate();
  child.prototype.constructor = child;
};

Util.randomVec = function (speed) {
  var rand = Math.random();
  var rand2 = Math.random();
  while (rand === rand2) { rand2 = Math.random(); }
  var signX = Math.random() > 0.5 ? 1 : -1;
  var signY = Math.random() > 0.5 ? 1 : -1;
  var dirX = rand * signX + speed;
  var dirY = rand2 * signY + speed ;
  return { x: dirX, y: dirY };
};

module.exports = Util;
