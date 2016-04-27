/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(10);
	var bloc, height, width;
	
	document.addEventListener("DOMContentLoaded", function () {
	  if (window.innerHeight > window.innerWidth) {
	    bloc = document.getElementById("main").offsetWidth / 64;
	    height = bloc * 92;
	    width = bloc * 64;
	  } else {
	    bloc = document.getElementById("main").offsetWidth / 92;
	    height = bloc * 64;
	    width = bloc * 92;
	  }
	
	  var canvasEl = document.getElementById("ctx"),
	      canvasIce = document.getElementById("ctx-ice"),
	      canvasScore = document.getElementById("score"),
	      canvasTimer = document.getElementById("timer");
	  canvasShroom = document.getElementById("shroom");
	
	  canvasEl.height = canvasIce.height = height;
	  canvasEl.width = canvasIce.width = width;
	  canvasScore.height = canvasTimer.height = canvasShroom.height = bloc * 10;
	  canvasScore.width = canvasTimer.width = bloc * 10;
	  canvasTimer.width = bloc * 14;
	  canvasShroom.width = bloc * 30;
	
	  var ctxScore = canvasScore.getContext("2d"),
	      ctxTimer = canvasTimer.getContext("2d"),
	      ctx = canvasEl.getContext("2d"),
	      ctx2 = canvasIce.getContext("2d"),
	      context = {
	    score: ctxScore,
	    timer: ctxTimer,
	    ctx2: ctx2
	  };
	
	  var game = new Game(context, width, height, bloc);
	
	  var view = new GameView(game, ctx, bloc);
	  view.bindKeyHandlers();
	  view.start();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Shell = __webpack_require__(2);
	var Mario = __webpack_require__(5);
	var Coin = __webpack_require__(7);
	var Score = __webpack_require__(8);
	var Timer = __webpack_require__(9);
	var Util = __webpack_require__(3);
	
	var DIMX, DIMY, SPACER;
	
	var shells = [];
	var coins = [];
	var destroyedShells = 0;
	
	var Game = function (context, width, height, size) {
	  DIMX = width;
	  DIMY = height;
	  SPACER = size;
	  this.mario = new Mario({ x: DIMX / 2, y: DIMY / 2 }, SPACER);
	  this.scatterCoins(context.ctx2);
	  this.score = new Score(context.score, SPACER);
	  this.timer = new Timer(context.timer, SPACER);
	  this.collected = [];
	};
	
	Game.prototype.isGameOver = function () {
	  if (this.mario.lives > 0 && coins.length > 0) {
	    return false;
	  } else {
	    return true;
	  }
	};
	
	Game.prototype.winner = function () {
	  if (coins.length > 0) {
	    return false;
	  } else {
	    return true;
	  }
	};
	
	Game.prototype.killMario = function () {
	  this.mario.reduceLives();
	  this.mario.relocate();
	};
	
	Game.prototype.restart = function () {
	  shells = [];
	  destroyedShells = 0;
	  this.scatterCoins();
	  this.score.resetScore();
	  this.timer.reset();
	  this.mario.setLives();
	  this.mario.relocate();
	};
	
	// sorts created objects into the correct private arrays
	Game.prototype.addObject = function (obj) {
	  if (obj instanceof Shell) {
	    shells.push(obj);
	  }
	  if (obj instanceof Coin) {
	    coins.push(obj);
	  }
	};
	
	var SHELL_SPEED = 2;
	// creates and loads all the objects in the game
	Game.prototype.createShells = function () {
	  if (this._numShells() <= shells.length) {
	    return;
	  }
	  var vel = Util.randomVec(SHELL_SPEED);
	  this.addObject(new Shell({
	    velocity: vel,
	    position: this.randomPosition(vel)
	  }, SPACER));
	};
	
	Game.prototype._numShells = function () {
	  return 4 + Math.floor(this.score.points / 10) - destroyedShells;
	};
	
	Game.prototype.scatterCoins = function (ctx2) {
	  coins = [];
	  var spacer = SPACER * 7.2;
	  var xTotal = Math.floor(DIMX / spacer);
	  var yTotal = Math.floor(DIMY / spacer);
	  for (var x = 0; x < xTotal; x++) {
	    for (var y = 0; y < yTotal; y++) {
	      var coin = new Coin({
	        x: x * spacer + spacer,
	        y: y * spacer + spacer
	      }, SPACER);
	      coins.push(coin);
	    }
	  }
	};
	
	// passes the context to each object drawing on the canvas
	Game.prototype.draw = function (ctx) {
	  ctx.clearRect(0, 0, DIMX, DIMY);
	  var allObjects = this.allObjects();
	  for (var i = 0; i < allObjects.length; i++) {
	    allObjects[i].draw(ctx);
	  }
	};
	
	// concats all the objects together to be rendered
	Game.prototype.allObjects = function () {
	  return coins.concat(shells, [this.mario]);
	};
	
	// applies the moving object logic on each target
	Game.prototype.moveObjects = function () {
	  var objects = this.allObjects();
	  for (var i = 0; i < objects.length; i++) {
	    var obj = objects[i];
	    if (obj instanceof Coin) {
	      continue;
	    }
	    obj.move(bounce, DIMX, DIMY);
	  }
	};
	
	Game.prototype.remove = function (obj) {
	  var index;
	  if (obj instanceof Shell) {
	    index = shells.indexOf(obj);
	    shells.splice(index, 1);
	    destroyedShells++;
	  }
	  if (obj instanceof Coin) {
	    index = coins.indexOf(obj);
	    coins.splice(index, 1);
	  }
	};
	
	// checks each object to see if mario collided with it
	Game.prototype.checkCollisions = function () {
	  if (this.mario.invincible) {
	    return;
	  }
	  var i, j, current;
	  for (i = 0; i < shells.length; i++) {
	    current = shells[i];
	    if (current.ghost) continue;
	    if (current.isCollidedWith(this.mario)) {
	      this.remove(current);
	      this.killMario();
	    }
	  }
	  for (i = 0; i < coins.length; i++) {
	    if (this.collected.includes(current)) continue;
	    current = coins[i];
	    if (current.isCollidedWith(this.mario)) {
	      this.collected.push(current);
	      current.spin(this.coinsCallback.bind(this, current));
	    }
	  }
	};
	
	Game.prototype.coinsCallback = function (current) {
	  this.remove(current);
	  this.score.updateScore(1);
	};
	
	// moves objects and checks to see if any of hit a collision trigger
	Game.prototype.step = function () {
	  this.moveObjects();
	  this.checkCollisions();
	};
	
	// spawns shells on the right and left boundies of the map
	Game.prototype.randomPosition = function (vel) {
	  var randY = Math.random() * DIMY * 0.8;
	  var leftRight;
	  if (Math.round(Math.random() * 2) === 1) {
	    leftRight = SPACER * 2;
	  } else {
	    leftRight = DIMX - SPACER * 2;
	  }
	  return { x: leftRight, y: randY + DIMY * 0.1 };
	};
	
	function isBouncingY(position, radius) {
	  radius = radius || 0;
	  return position.y - radius < 0 || position.y + radius > DIMY;
	}
	
	function isBouncingX(position, radius) {
	  radius = radius || 0;
	  return position.x - radius < 0 || position.x + radius > DIMX;
	}
	
	function bounce(object) {
	  var pos = object.position;
	  var rad = object.radius;
	
	  if (isBouncingY(pos, rad) && isBouncingX(pos, rad)) {
	    if (object === this.mario) {
	      object.velocity.x = object.velocity.x / 2;
	      object.velocity.y = object.velocity.y / 2;
	      if (pos.x < rad) {
	        pos.x = rad + 1;
	      } else if (pos.x > DIMX - rad) {
	        pos.x = DIMX - rad - 1;
	      }
	      if (pos.y < rad) {
	        pos.y = rad + 1;
	      } else if (pos.y > DIMY - rad) {
	        pos.y = DIMY - rad - 1;
	      }
	    }
	    object.velocity.x *= -1;
	    object.velocity.y *= -1;
	  } else if (isBouncingY(pos, rad)) {
	    if (object instanceof Mario) {
	      object.velocity.x = object.velocity.x / 2;
	      object.velocity.y = object.velocity.y / 2;
	      if (pos.y < rad) {
	        pos.y = rad + 1;
	      } else if (pos.y > DIMY - rad) {
	        pos.y = DIMY - rad - 1;
	      }
	    }
	    object.velocity.y *= -1;
	  } else if (isBouncingX(pos, rad)) {
	    if (object instanceof Mario) {
	      object.velocity.x = object.velocity.x / 2;
	      object.velocity.y = object.velocity.y / 2;
	    }
	    if (pos.x < rad) {
	      pos.x = rad + 1;
	    } else if (pos.x > DIMX - rad) {
	      pos.x = DIMX - rad - 1;
	    }
	    object.velocity.x *= -1;
	  }
	}
	
	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	
	function Shell(options, size) {
	  options.color = options.color || '#2f5c23';
	  options.radius = size * 1.8;
	  MovingObject.call(this, options);
	  this.ticks = 0;
	  this.frame = 0;
	  this.ghost = true;
	  window.setTimeout(function () {
	    this.ghost = false;
	  }.bind(this), 800);
	}
	
	Util.inherit(Shell, MovingObject);
	
	Shell.prototype.ticksPerFrame = function () {
	  if (this.ticks <= 5) {
	    this.ticks++;
	  } else {
	    this.ticks = 0;
	    this.nextFrame();
	  }
	};
	
	Shell.prototype.nextFrame = function () {
	  if (this.frame++ >= 5) {
	    this.frame = 0;
	  } else {
	    this.frame = this.frame++;
	  }
	};
	
	Shell.prototype.draw = function (ctx) {
	  this.ticksPerFrame();
	  var offset = this.frame * 40;
	  if (this.ghost) {
	    ctx.save();
	    ctx.globalAlpha = 0.4;
	  }
	  ctx.drawImage(document.getElementById('green'), // sprite
	  0 + offset, // offset x
	  0, // offset y
	  40, // frameWidth
	  40, // frameHeight
	  this.position.x - this.radius, // draw at x
	  this.position.y - this.radius, // draw at y
	  this.radius * 2, // actualWidth
	  this.radius * 2 // actualHeight
	  );
	  if (this.ghost) {
	    ctx.restore();
	  }
	};
	
	module.exports = Shell;

/***/ },
/* 3 */
/***/ function(module, exports) {

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
	  while (rand === rand2) {
	    rand2 = Math.random();
	  }
	  var signX = Math.random() > 0.5 ? 1 : -1;
	  var signY = Math.random() > 0.5 ? 1 : -1;
	  var dirX = rand * signX + speed;
	  var dirY = rand2 * signY + speed;
	  return { x: dirX, y: dirY };
	};
	
	module.exports = Util;

/***/ },
/* 4 */
/***/ function(module, exports) {

	
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
	  ctx.arc(this.position.x, this.position.y, this.radius, 0, // startAngle
	  2 * Math.PI, //endAngle
	  false // counter-clockwise
	  );
	  ctx.fill();
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObj) {
	  var vectorX = this.position.x - otherObj.position.x;
	  var vectorY = this.position.y - otherObj.position.y;
	  var radii = this.radius + otherObj.radius;
	  return vectorX * vectorX + vectorY * vectorY <= radii * radii;
	};
	
	MovingObject.prototype.move = function (wrapCallback, maxHeight, maxWidth) {
	  this.position.x += this.velocity.x;
	  this.position.y += this.velocity.y;
	  wrapCallback(this);
	};
	
	module.exports = MovingObject;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(4);
	var Health = __webpack_require__(6);
	var Util = __webpack_require__(3);
	
	var MAX_VELOCITY = 5;
	
	function Mario(position, size) {
	  MovingObject.call(this, {
	    position: { x: position.x, y: position.y },
	    velocity: { x: 0, y: 0 },
	    color: '#f00f00',
	    radius: size * 1.8
	  });
	  this._initialPosition = position;
	  this._angle = 0;
	  this.ticks = 0;
	  this.frame = 1;
	  this.health = new Health(size);
	  this.faceDir = { up: false, down: true, right: false, left: false };
	  this.size = size * 3;
	  this.lives = 3;
	  this.invincible = false;
	}
	
	Util.inherit(Mario, MovingObject);
	
	Mario.prototype.someFriction = function () {
	  var modX = 0,
	      modY = 0;
	  if (this.velocity.x > 0) {
	    modX = -0.05;
	  } else if (this.velocity.x < 0) {
	    modX = 0.05;
	  }
	  if (this.velocity.y > 0) {
	    modY = -0.05;
	  } else if (this.velocity.y < 0) {
	    modY = +0.05;
	  }
	  this.velocity.x += modX;
	  this.velocity.y += modY;
	};
	
	Mario.prototype.reduceLives = function () {
	  this.lives -= 1;
	  this.health.damageHealth();
	  this.invincible = true;
	  window.setTimeout(function () {
	    this.invincible = false;
	  }.bind(this), 1200);
	};
	
	Mario.prototype.setLives = function (n) {
	  this.lives = n || 3;
	  this.health.resetHealth();
	};
	
	Mario.prototype.relocate = function () {
	  this.position.x = this._initialPosition.x;
	  this.position.y = this._initialPosition.y;
	  this.velocity.x = 0;
	  this.velocity.y = 0;
	  this._angle = 0;
	};
	
	Mario.prototype.power = function (impulse) {
	  var impulseX = impulse * Math.cos(this._angle);
	  var impulseY = impulse * Math.sin(this._angle);
	  var length = this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y;
	  if (length > MAX_VELOCITY * MAX_VELOCITY) {
	    var signVX = this.velocity.x < 0;
	    var signVY = this.velocity.y < 0;
	    var signIX = impulseX < 0;
	    var signIY = impulseY < 0;
	    if (signVX ^ signIX) {
	      this.velocity.x += impulseX;
	    }
	    if (signVY ^ signIY) {
	      this.velocity.y += impulseY;
	    }
	  } else {
	    this.velocity.x += impulseX;
	    this.velocity.y += impulseY;
	  }
	};
	
	Mario.prototype.walk = function (dir) {
	  if (dir.up === true || dir.down === true || dir.left === true || dir.right === true) {
	    this.faceDir = dir;
	  }
	  if (dir.up && dir.right) {
	    this._angle = 315 * (Math.PI / 180.0);
	  } else if (dir.up && dir.left) {
	    this._angle = 225 * (Math.PI / 180.0);
	  } else if (dir.up) {
	    this._angle = 270 * (Math.PI / 180.0);
	  } else if (dir.down && dir.right) {
	    this._angle = 45 * (Math.PI / 180.0);
	  } else if (dir.down && dir.left) {
	    this._angle = 135 * (Math.PI / 180.0);
	  } else if (dir.down) {
	    this._angle = 90 * (Math.PI / 180.0);
	  } else if (dir.left) {
	    this._angle = 180 * (Math.PI / 180.0);
	  } else if (dir.right) {
	    this._angle = 360 * (Math.PI / 180.0);
	  }
	  this.power(0.1);
	};
	
	Mario.prototype._getFacing = function () {
	  if (this.faceDir.up && this.faceDir.right) {
	    return { dx: 132, dy: 195 };
	  } else if (this.faceDir.up && this.faceDir.left) {
	    return { dx: 132, dy: 65 };
	  } else if (this.faceDir.up) {
	    return { dx: 0, dy: 195 };
	  } else if (this.faceDir.down && this.faceDir.right) {
	    return { dx: 132, dy: 130 };
	  } else if (this.faceDir.down && this.faceDir.left) {
	    return { dx: 132, dy: 0 };
	  } else if (this.faceDir.right) {
	    return { dx: 0, dy: 130 };
	  } else if (this.faceDir.left) {
	    return { dx: 0, dy: 65 };
	  } else if (this.faceDir.down) {
	    return { dx: 0, dy: 0 };
	  } else {
	    return this.lastDir;
	  }
	};
	
	Mario.prototype.ticksPerFrame = function () {
	  var curVel = Math.abs(this.velocity.x) + Math.abs(this.velocity.y);
	  if (curVel < 0.5) {
	    this.tick = 0;
	    this.frame = 1;
	    return;
	  }
	  var rate = 20 - curVel * 2;
	  if (this.ticks <= rate) {
	    this.ticks++;
	  } else {
	    this.ticks = 0;
	    this.nextFrame();
	  }
	};
	
	Mario.prototype.nextFrame = function () {
	  if (this.frame++ >= 2) {
	    this.frame = 0;
	  } else {
	    this.frame = this.frame++;
	  }
	};
	
	Mario.prototype.draw = function (ctx) {
	  this.health.draw();
	  this.ticksPerFrame();
	  var facing = this._getFacing();
	  this.lastDir = facing;
	  var offset = this.frame * 44;
	
	  if (this.invincible) {
	    ctx.save();
	    ctx.globalAlpha = 0.4;
	  }
	  ctx.drawImage(document.getElementById('mario'), // sprite
	  facing.dx + offset, // offset x
	  facing.dy, // offset y
	  44, // frameWidth
	  65, // frameHeight
	  this.position.x - this.size * 0.85, // draw at x
	  this.position.y - this.size * 1.2, // draw at y
	  this.size * 1.6, // frameWidth
	  this.size * 2.08 // frameHeight
	  );
	  if (this.invincible) {
	    ctx.restore();
	  }
	};
	
	module.exports = Mario;

/***/ },
/* 6 */
/***/ function(module, exports) {

	function Health(size) {
	  canvasHealth = document.getElementById("shroom");
	  var ctx = canvasHealth.getContext("2d");
	  this.ctx = ctx;
	  this.shrooms = [0, 0, 0];
	  this.resetHealth();
	  this.size = size;
	}
	
	Health.prototype.damageHealth = function () {
	  if (this.shrooms[0] === 0) {
	    this.damage(this.shrooms, 0);
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
	      }, 200);
	    }, 200);
	  }, 200);
	};
	
	var drawShroom = function (ctx, shroom, idx, size, spacer) {
	  var offset = 64 * shroom[idx];
	  ctx.drawImage(document.getElementById('mush'), // sprite
	  0 + offset, // offset x
	  0, // offset y
	  64, // frameWidth
	  64, // frameHeight
	  size * spacer, // draw at x
	  size * 2, // draw at y
	  size * 5, // actualWidth
	  size * 5 // actualHeight
	  );
	};
	
	Health.prototype.draw = function () {
	  this.ctx.clearRect(0, 0, this.size * 30, this.size * 10);
	  drawShroom(this.ctx, this.shrooms, 0, this.size, 3);
	  drawShroom(this.ctx, this.shrooms, 1, this.size, 12);
	  drawShroom(this.ctx, this.shrooms, 2, this.size, 21);
	};
	
	module.exports = Health;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	
	function Coin(coord, size) {
	  options = { position: coord };
	  options.color = "#d6b52d";
	  options.radius = size * 2;
	  options.velocity = { x: 0, y: 0 };
	  MovingObject.call(this, options);
	  this.frame = 1;
	}
	
	Util.inherit(Coin, MovingObject);
	
	Coin.prototype.ticksPerFrame = function () {
	  if (this.ticks <= 1) {
	    this.ticks++;
	  } else {
	    this.ticks = 0;
	    this.nextFrame();
	  }
	};
	
	Coin.prototype.nextFrame = function () {
	  if (this.frame++ >= 9) {
	    this.callback();
	  } else {
	    this.frame = this.frame++;
	  }
	};
	
	Coin.prototype.spin = function (callback) {
	  this.spinOnce = true;
	  this.callback = callback;
	};
	
	Coin.prototype.draw = function (ctx) {
	  var offset = 0;
	  if (this.spinOnce) {
	    this.ticksPerFrame();
	    offset = this.frame * 44;
	  }
	  ctx.drawImage(document.getElementById('coin'), // sprite
	  0 + offset, // offset x
	  0, // offset y
	  44, // frameWidth
	  40, // frameHeight
	  this.position.x - this.radius / 2, // draw at x
	  this.position.y - this.radius / 2, // draw at y
	  this.radius, // actualWidth
	  this.radius // actualHeight
	  );
	};
	
	module.exports = Coin;

/***/ },
/* 8 */
/***/ function(module, exports) {

	function Score(ctx, size) {
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
	
	Score.prototype.draw = function (num) {};
	
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
	  this.ctx.clearRect(0, 0, this.spacer * 18, this.spacer * 16);
	  var offset = 0;
	  this.ticksPerFrame();
	  offset = this.frame * 44;
	  this.ctx.drawImage(document.getElementById('coin'), // sprite
	  0 + offset, // offset x
	  0, // offset y
	  44, // frameWidth
	  40, // frameHeight
	  0 + this.spacer / 2.5, // draw at x
	  0 + this.spacer * 2, // draw at y
	  this.spacer * 4, // actualWidth
	  this.spacer * 4 // actualHeight
	  );
	  this.ctx.fillStyle = "black";
	  this.ctx.font = "bold " + this.spacer * 4 + "px Courier New";
	  this.ctx.fillText(this.points, this.spacer * 5, this.spacer * 6);
	};
	
	module.exports = Score;

/***/ },
/* 9 */
/***/ function(module, exports) {

	function Timer(ctx, size) {
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
	  return mm + ":" + ss;
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
	  this.ctx.clearRect(0, 0, this.size * 20, this.size * 20);
	  var time = formatTime(this.startTime, this.pausedSeconds);
	
	  this.ctx.fillStyle = "black";
	  this.ctx.font = "bold " + this.size * 4 + "px Courier New";
	  this.ctx.textAlign = "left";
	  this.ctx.fillText(time, this.size, this.size * 6);
	};
	
	module.exports = Timer;

/***/ },
/* 10 */
/***/ function(module, exports) {

	var GameView = function (game, ctx, size) {
	  this._game = game;
	  this._ctx = ctx;
	  this.keysDown = {};
	  this.running = false;
	  this.playing = false;
	  this.throttle = false;
	  this.initialize = false;
	  this.gameState = ""; //("won", "lost")
	  this.size = size;
	  this.createModal();
	};
	
	var KEYCODES = {
	  w: 87,
	  up: 38,
	  a: 65,
	  left: 37,
	  d: 68,
	  right: 39,
	  s: 83,
	  down: 40,
	  space: 32
	};
	
	// 87 / 38 up
	// 65 / 37 left
	// 68 / 39 right
	// 83 / 40 down
	// 32 space
	
	// kicks off the animation frames
	GameView.prototype.start = function () {
	  var that = this;
	
	  if (!this.initialize) {
	    this.loadNewGameModal();
	  } else {
	    this.playing = true;
	    this.running = true;
	  }
	
	  var animation = function () {
	    if (that.playing === false || that.running === false) return;
	    that._game.createShells();
	    that._game.step();
	    that._game.draw(that._ctx);
	    that._game.score.draw();
	    that._game.timer.draw();
	
	    var mario = that._game.mario;
	
	    if (that.keysDown.up === true || that.keysDown.left === true || that.keysDown.right === true || that.keysDown.down === true) {
	
	      mario.walk(that.keysDown);
	    } else {
	      mario.someFriction();
	    }
	
	    that.checkForGameOver();
	    window.requestAnimationFrame(animation);
	  };
	
	  animation();
	};
	
	GameView.prototype.createModal = function () {
	  var modal = document.createElement("div");
	  var logo = document.createElement("img");
	  var button = document.createElement("img");
	  var won = document.createElement("img");
	  var lost = document.createElement("img");
	  modal.classList.add("new-game-modal");
	  modal.classList.add("content");
	  logo.src = "./assets/images/MarioLogo.svg";
	  logo.width = this.size * 50;
	  button.src = "./assets/images/MarioPlay.svg";
	  button.width = this.size * 15;
	  won.src = "./assets/images/thumbsup.png";
	  lost.src = "./assets/images/bowser.gif";
	  won.width = lost.width = this.size * 15;
	
	  this.logo = logo;
	  this.button = button;
	  this.modal = modal;
	  this.won = won;
	  this.lost = lost;
	};
	
	GameView.prototype.checkForGameOver = function () {
	  if (this._game.isGameOver()) {
	    if (this._game.winner()) {
	      this.gameState = "won";
	    } else {
	      this.gameState = "lost";
	    }
	    this.running = false;
	    this.playing = false;
	    this.initialize = false;
	
	    this.loadNewGameModal();
	  }
	};
	
	GameView.prototype.togglePlay = function () {
	  if (this.playing === false) {
	    this.playing = true;
	    this.start();
	    this._game.timer.unpauseTimer();
	  } else {
	    this.playing = false;
	    this._game.timer.pauseTimer();
	  }
	};
	
	GameView.prototype.loadNewGameModal = function () {
	  var main = document.getElementById("main");
	  main.appendChild(this.modal);
	  this.modal.appendChild(this.logo);
	  if (this.gameState === "won") {
	    this.modal.appendChild(this.won);
	  } else if (this.gameState === "lost") {
	    this.modal.appendChild(this.lost);
	  }
	  this.modal.appendChild(this.button);
	  this.button.addEventListener("click", this.startGame.bind(this));
	};
	
	GameView.prototype.startGame = function () {
	  this.initialize = true;
	  if (this.gameState === "win") {
	    this.modal.removeChild(this.won);
	  } else if (this.gameState === "lose") {
	    this.modal.removeChild(this.lost);
	  }
	  this.gameState = "";
	  this._game.restart();
	  if (Array.prototype.indexOf.call(main.childNodes, this.modal)) {
	    main.removeChild(this.modal);
	  }
	  this.start();
	};
	
	GameView.prototype.checkKey = function (e) {
	  if (e.keyCode === KEYCODES.space && this.running) {
	    this.togglePlay();
	    e.preventDefault();
	  } else if (e.keyCode === KEYCODES.space && !this.running) {
	    this.startGame();
	    e.preventDefault();
	  }
	};
	
	// private method to translate keycodes into switch directions
	function readDir(keyCode) {
	  if (keyCode === KEYCODES.w || keyCode === KEYCODES.up) {
	    return "up";
	  } else if (keyCode === KEYCODES.s || keyCode === KEYCODES.down) {
	    return "down";
	  } else if (keyCode === KEYCODES.d || keyCode === KEYCODES.right) {
	    return "right";
	  } else if (keyCode === KEYCODES.a || keyCode === KEYCODES.left) {
	    return "left";
	  }
	}
	
	// loads key bindings used for the game
	GameView.prototype.bindKeyHandlers = function () {
	  var that = this;
	
	  this.keydown = window.addEventListener("keydown", function (event) {
	    var dir = readDir(event.keyCode);
	    switch (dir) {
	      case "up":
	        that.keysDown.up = true;
	        event.preventDefault();
	        break;
	      case "down":
	        that.keysDown.down = true;
	        event.preventDefault();
	        break;
	      case "right":
	        that.keysDown.right = true;
	        event.preventDefault();
	        break;
	      case "left":
	        that.keysDown.left = true;
	        event.preventDefault();
	        break;
	    }
	  });
	
	  this.keypress = window.addEventListener("keypress", this.checkKey.bind(this));
	
	  // orientation detection for phone tilt control
	  this.orient = window.addEventListener('deviceorientation', function (event) {
	    if (event.gamma > 10 && event.beta > 10) {
	      //up right
	      that.keysDown.up = true;
	      that.keysDown.right = true;
	      that.keysDown.down = false;
	      that.keysDown.left = false;
	    } else if (event.gamma > 10 && event.beta < -10) {
	      // up left
	      that.keysDown.up = true;
	      that.keysDown.right = false;
	      that.keysDown.down = false;
	      that.keysDown.left = true;
	    } else if (event.gamma > 10) {
	      //up
	      that.keysDown.up = true;
	      that.keysDown.right = false;
	      that.keysDown.down = false;
	      that.keysDown.left = false;
	    } else if (event.gamma < -10 && event.beta > 10) {
	      //down right
	      that.keysDown.up = false;
	      that.keysDown.right = true;
	      that.keysDown.down = true;
	      that.keysDown.left = false;
	    } else if (event.gamma < -10 && event.beta < -10) {
	      //down left
	      that.keysDown.up = false;
	      that.keysDown.right = false;
	      that.keysDown.down = true;
	      that.keysDown.left = true;
	    } else if (event.gamma < -10) {
	      // down
	      that.keysDown.up = false;
	      that.keysDown.right = false;
	      that.keysDown.down = true;
	      that.keysDown.left = false;
	    } else if (event.gamma > -10 && event.gamma < 10 && event.beta > -10 && event.beta < 10) {
	      //middle-ish
	      that.keysDown.up = false;
	      that.keysDown.right = false;
	      that.keysDown.down = false;
	      that.keysDown.left = false;
	    }
	  });
	
	  this.keyup = window.addEventListener("keyup", function (event) {
	    var dir = readDir(event.keyCode);
	    switch (dir) {
	      case "up":
	        that.keysDown.up = false;
	        event.preventDefault();
	        break;
	      case "down":
	        that.keysDown.down = false;
	        event.preventDefault();
	        break;
	      case "right":
	        that.keysDown.right = false;
	        event.preventDefault();
	        break;
	      case "left":
	        that.keysDown.left = false;
	        event.preventDefault();
	        break;
	    }
	  });
	};
	
	module.exports = GameView;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map