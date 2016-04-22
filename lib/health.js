function Health (size) {
  canvasHealth = document.getElementById("shroom");
  canvasHealth.width = spacer * 6;
  canvasHealth.height = spacer * 10;
  var ctx = canvasHealth.getContext("2d");
  this.ctx = ctx;
  this.shrooms = [0,0,0];
  this.resetHealth();
  this.size = size;
}

Health.prototype.damageHealth = function () {
  if (this.shrooms[0] === 0) {
    this.damage(this.shrooms, 0);
    console.log("firstblood");
  } else if (this.shrooms[1] === 0) {
    this.damage(this.shrooms, 1);
  } else if (this.shrooms[2] === 0) {
    this.damage(this.shrooms, 2);
  }
};

Health.prototype.resetHealth = function (n) {
  this.shrooms = [0, 0, 0];
};

Health.prototype.damage = function (shroom, idx) {
  var that = this;
  window.setTimeout(function () {
    shroom[idx] = shroom[idx] + 1;
    that.draw();
    window.setTimeout(function () {
      shroom[idx] = shroom[idx] + 1;
      that.draw();
      window.setTimeout(function () {
        shroom[idx] = shroom[idx] + 1;
        that.draw();
      },200);
    },200);
  },200);
};

var drawShroom = function (ctx, shroom, idx, size, spacer) {
  var offset = 64 * shroom[idx];
  console.log(offset);
  ctx.drawImage(
    document.getElementById('mush'), // sprite
    0 + offset, // offset x
    0, // offset y
    64, // frameWidth
    64, // frameHeight
    size * 2, // draw at x
    size * spacer, // draw at y
    size * 2, // actualWidth
    size * 2 // actualHeight
  );
};

Health.prototype.draw = function () {
  console.log("health tries to draw");
  this.ctx.clearRect(0, 0, this.size*6, this.size*10);
  drawShroom(this.ctx, this.shrooms, 0, this.size, 1);
  drawShroom(this.ctx, this.shrooms, 1, this.size, 4);
  drawShroom(this.ctx, this.shrooms, 2, this.size, 7);
};

module.exports = Health;
