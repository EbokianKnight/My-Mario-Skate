function Score (ctx, size) {
  this.ctx = ctx;
  this.points = 0;
  this.frame = 1;
  this.ticks = 0;
  this.spacer = size;
}

Score.prototype.updateScore = function (num) {
  this.points = this.points + num;
};

Score.prototype.resetScore = function () {
  this.points = 0;
};

Score.prototype.draw = function (num) {

};

Score.prototype.ticksPerFrame = function () {
  if (this.ticks <= 2) {
    this.ticks++;
  } else {
    this.ticks = 0;
    this.nextFrame();
  }
};

Score.prototype.nextFrame = function () {
  if (this.frame++ >= 9) {
    this.frame = 0;
  } else {
    this.frame = this.frame++;
  }
};

Score.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.spacer*6, this.spacer*3);
  var offset = 0;
  this.ticksPerFrame();
  offset = this.frame * 44;
  this.ctx.drawImage(
    document.getElementById('coin'), // sprite
    0 + offset, // offset x
    0, // offset y
    44, // frameWidth
    40, // frameHeight
    0 + (this.spacer / 2), // draw at x
    0 + (this.spacer / 2), // draw at y
    this.spacer * 2, // actualWidth
    this.spacer * 2 // actualHeight
  );
  this.ctx.fillStyle = "black";
  this.ctx.font = "bold 4vh Courier New";
  this.ctx.fillText(this.points, this.spacer * 3.2, this.spacer * 2);
};

module.exports = Score;
