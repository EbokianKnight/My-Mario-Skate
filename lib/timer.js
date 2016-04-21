function Timer (ctx, size) {
  this.ctx = ctx;
  this.size = size;
  this.startTime = Date.now();
}

var formatTime = function (before) {
  var time = Date.now();
  seconds = (time - before) / 1000;
  ss = Math.floor(seconds % 60);
  mm = Math.floor(seconds / 60);
  if (ss < 10) {
    ss = "0" + ss;
  }
  return (mm + ":" + ss);
};

Timer.prototype.reset = function () {
  this.startTime = Date.now();
};

Timer.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.size*6, this.size*3);
  var time = formatTime(this.startTime);

  this.ctx.fillStyle = "black";
  this.ctx.font = "bold 3vh Courier New";
  this.ctx.textAlign="center";
  this.ctx.fillText(time, this.size * 3, this.size * 1.5);
};

module.exports = Timer;
