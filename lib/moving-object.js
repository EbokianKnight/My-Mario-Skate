
function MovingObject(options) {
  this.position = options.position;
  this.velocity = options.velocity;
  this.radius = options.radius;
  this.color = options.color;
  this.isBouncable = true;
}

MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.position.x,
    this.position.y,
    this.radius,
    0, // startAngle
    2 * Math.PI, //endAngle
    false // counter-clockwise
  );
  ctx.fill();

};

MovingObject.prototype.isCollidedWith = function (otherObj) {
  var vectorX = this.position.x - otherObj.position.x;
  var vectorY = this.position.y - otherObj.position.y;
  var radii = this.radius + otherObj.radius;
  return (vectorX * vectorX + vectorY * vectorY <= radii * radii);
};

MovingObject.prototype.move = function (wrapCallback, maxHeight, maxWidth) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  wrapCallback(this);
};

module.exports = MovingObject;
