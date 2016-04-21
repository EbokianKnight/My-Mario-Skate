function Timer (ctx, size) {
  this.ctx = ctx;
  this.size = size;
  this.startTime = Date.now();
  this.pausedtime = 0;
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
  this.pausedtime = Date.now();
};

Timer.prototype.unpauseTimer = function () {
  var now = Date.now();
  this.pausedtime = Math.abs(this.pausedtime - now);
};

Timer.prototype.reset = function () {
  this.startTime = Date.now();
};

Timer.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.size*6, this.size*3);
  var time = formatTime(this.startTime, this.pausedtime);

  this.ctx.fillStyle = "black";
  this.ctx.font = "bold 3vh Courier New";
  this.ctx.textAlign="center";
  this.ctx.fillText(time, this.size * 3, this.size * 1.5);
};

module.exports = Timer;
