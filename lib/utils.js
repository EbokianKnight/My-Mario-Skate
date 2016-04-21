var Util = {};

Util.inherit = function (child, klass) {
  function Surrogate() {}
  Surrogate.prototype = klass.prototype;
  child.prototype = new Surrogate();
  child.prototype.constructor = child;
};

Util.randomVec = function (length) {
  var rand = Math.random();
  var signX = Math.random() > 0.5 ? 1 : -1;
  var signY = Math.random() > 0.5 ? 1 : -1;
  return { x: rand * length * signX, y: (1 - rand) * length * signY };
};

module.exports = Util;
