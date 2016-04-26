function Timer (ctx, size) {
  this.ctx = ctx;
  this.size = size;
  this.startTime = Date.now();
  this.pausedTimestamp = 0;
  this.pausedSeconds = 0;
}

var formatTime = function (before, paused) {
  var time = Date.now() - paused;
  seconds = (time - before) / 1000;
  ss = Math.floor(seconds % 60);
  mm = Math.floor(seconds / 60);
  if (ss < 10) {
    ss = "0" + ss;
  }
  return (mm + ":" + ss);
};

Timer.prototype.pauseTimer = function () {
  this.pausedTimestamp = Date.now();
};

Timer.prototype.unpauseTimer = function () {
  var seconds = Date.now() - this.pausedTimestamp;
  this.pausedSeconds += seconds;
};

Timer.prototype.reset = function () {
  this.startTime = Date.now();
  this.pausedTimestamp = 0;
  this.pausedSeconds = 0;
};

Timer.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.size*20, this.size*20);
  var time = formatTime(this.startTime, this.pausedSeconds);

  this.ctx.fillStyle = "black";
  this.ctx.font = "bold " + this.size*4 + "px Courier New";
  this.ctx.textAlign="left";
  this.ctx.fillText(time, this.size, this.size *6);
};

module.exports = Timer;
