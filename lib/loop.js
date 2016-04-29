var LoopInterface = function() {
};

/**
 * Resets the loop.
 */
LoopInterface.prototype.reset = function () {};

/**
 * Updates the loop's timer.
 * @param {Function(Number)} callback the callback to run when ready.
 */
LoopInterface.prototype.update = function (callback) {};

module.exports.LoopInterface = LoopInterface;

/**
 * Naive loop implementation that only limits max updates.
 * Delta times will always be based on the max per seconds.
 * @param {Number} maxUpdatePerSecond the max the game will update per second.
 * @extends LoopInterface
 */
var Loop = function(maxUpdatesPerSecond) {
  LoopInterface.call(this);

  this._maxUpdatesPerSecond = maxUpdatesPerSecond || 60;

  this._lastUpdate = Date.now();
};
Loop.prototype = Object.create(LoopInterface.prototype);

Loop.prototype.reset = function () {
  this._lastUpdate = Date.now();
};

Loop.prototype.update = function (callback) {
  var now = Date.now();
  var updateDelta = now - this._lastUpdate;
  var timeBetweenUpdates = 1000 / this._maxUpdatesPerSecond;

  if (updateDelta >= timeBetweenUpdates && callback) {
    callback(Math.floor(timeBetweenUpdates));
    this._lastUpdate = Date.now();
  }
};

module.exports.Loop = Loop;
