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
	var GameView = __webpack_require__(6);
	
	document.addEventListener("DOMContentLoaded", function () {
	  var padding = 0.027,
	      height,
	      width;
	  if (window.innerHeight > window.innerWidth) {
	    spacer = Math.floor(padding * window.innerHeight);
	    width = spacer * 20;
	    height = spacer * 34;
	  } else {
	    spacer = Math.floor(padding * window.innerWidth);
	    height = spacer * 20;
	    width = spacer * 34;
	  }
	
	  var canvasEl = document.getElementById("ctx"),
	      canvasIce = document.getElementById("ctx-ice"),
	      canvasScore = document.getElementById("score"),
	      canvasTimer = document.getElementById("timer");
	
	  canvasEl.height = canvasIce.height = height;
	  canvasEl.width = canvasIce.width = width;
	  canvasScore.height = canvasTimer.height = spacer * 3;
	  canvasScore.width = canvasTimer.width = spacer * 6;
	
	  var ctxScore = canvasScore.getContext("2d"),
	      ctxTimer = canvasTimer.getContext("2d"),
	      ctx = canvasEl.getContext("2d"),
	      ctx2 = canvasIce.getContext("2d"),
	      context = {
	    score: ctxScore,
	    timer: ctxTimer,
	    ctx2: ctx2
	  };
	
	  var game = new Game(context, width, height, spacer);
	
	  var view = new GameView(game, ctx);
	  view.bindKeyHandlers();
	  view.start();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Shell = __webpack_require__(2);
	var Mario = __webpack_require__(5);
	var Coin = __webpack_require__(8);
	var Score = __webpack_require__(9);
	var Timer = __webpack_require__(10);
	var Util = __webpack_require__(3);
	
	var DIMX, DIMY, SPACER;
	
	var shells = [];
	var coins = [];
	
	var Game = function (context, width, height, spacer) {
	  DIMX = width;
	  DIMY = height;
	  SPACER = spacer;
	  this.mario = new Mario({ x: DIMX / 2, y: DIMY / 2 }, SPACER);
	  this.scatterCoins(context.ctx2);
	  this.score = new Score(context.score, SPACER);
	  this.timer = new Timer(context.timer, SPACER);
	  this.collected = [];
	};
	
	Game.prototype.isGameOver = function () {
	  if (this.mario.lives > 0 || coins.length === 0) {
	    return false;
	  } else {
	    console.log("GAMEOVER");
	    return true;
	  }
	};
	
	Game.prototype.killMario = function () {
	  this.mario.reduceLives();
	  this.mario.relocate();
	};
	
	Game.prototype.restart = function () {
	  shells = [];
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
	  var numShells = 5 + Math.floor(this.score.points / 10);
	  if (numShells <= shells.length) {
	    return;
	  }
	  var vel = Util.randomVec(SHELL_SPEED);
	  this.addObject(new Shell({
	    velocity: vel,
	    position: this.randomPosition(vel)
	  }, SPACER));
	};
	
	Game.prototype.scatterCoins = function (ctx2) {
	  coins = [];
	  var spacer = SPACER * 3;
	  var xTotal = Math.floor(DIMX / spacer);
	  var yTotal = Math.floor(DIMY / spacer);
	  for (var x = 0; x < xTotal; x++) {
	    for (var y = 0; y < yTotal; y++) {
	      var coin = new Coin({
	        x: x * spacer + SPACER * 2,
	        y: y * spacer + SPACER * 2
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
	    obj.move(bounce);
	  }
	};
	
	Game.prototype.remove = function (obj) {
	  var index;
	  if (obj instanceof Shell) {
	    index = shells.indexOf(obj);
	    shells.splice(index, 1);
	  }
	  if (obj instanceof Coin) {
	    index = coins.indexOf(obj);
	    coins.splice(index, 1);
	  }
	};
	
	// checks each object to see if mario collided with it
	Game.prototype.checkCollisions = function () {
	  var i, j, current;
	  for (i = 0; i < shells.length; i++) {
	    current = shells[i];
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
	  var randY = Math.random() * DIMY - SPACER * 2;
	  var leftRight;
	  if (vel.x > 0) {
	    leftRight = SPACER;
	  } else {
	    leftRight = DIMX - SPACER;
	  }
	  return { x: leftRight, y: randY + SPACER };
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
	    object.velocity.x *= -1;
	    object.velocity.y *= -1;
	  } else if (isBouncingY(pos, rad)) {
	    object.velocity.y *= -1;
	  } else if (isBouncingX(pos, rad)) {
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
	  options.radius = size / 2;
	  MovingObject.call(this, options);
	}
	
	Util.inherit(Shell, MovingObject);
	
	// SO LAGGY
	// Shell.prototype.draw = function (ctx) {
	//   ctx.drawImage(
	//     document.getElementById('green'), // sprite
	//     this.position.x - this.radius, // draw at x
	//     this.position.y - this.radius, // draw at y
	//     this.radius * 2, // frameWidth
	//     this.radius * 2 // frameHeight
	//   );
	// };
	
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
	
	MovingObject.prototype.move = function (wrapCallback) {
	  this.position.x += this.velocity.x;
	  this.position.y += this.velocity.y;
	  wrapCallback(this);
	};
	
	module.exports = MovingObject;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(3);
	
	var MAX_VELOCITY = 5;
	
	function Mario(position, size) {
	  MovingObject.call(this, {
	    position: { x: position.x, y: position.y },
	    velocity: { x: 0, y: 0 },
	    color: '#f00f00',
	    radius: size
	  });
	  this._initialPosition = position;
	  this._angle = 0;
	  this.ticks = 0;
	  this.frame = 1;
	  this.faceDir = { up: false, down: true, right: false, left: false };
	  this.size = size;
	  this.lives = 3;
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
	};
	
	Mario.prototype.setLives = function (n) {
	  this.lives = n || 3;
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
	  this.ticksPerFrame();
	  var facing = this._getFacing();
	  this.lastDir = facing;
	  var offset = this.frame * 44;
	
	  ctx.drawImage(document.getElementById('mario'), // sprite
	  facing.dx + offset, // offset x
	  facing.dy, // offset y
	  44, // frameWidth
	  65, // frameHeight
	  this.position.x - this.size, // draw at x
	  this.position.y - this.size, // draw at y
	  this.size * 2, // frameWidth
	  this.size * 2.6 // frameHeight
	  );
	};
	
	module.exports = Mario;

/***/ },
/* 6 */
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
	  this._game = game;
	  this._ctx = ctx;
	  this.keysDown = {};
	  this.running = false;
	  this.playing = false;
	  this.throttle = false;
	  this.initialize = false;
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
	  var logo = document.createElement("div");
	  var button = document.createElement("div");
	  modal.classList.add("new-game-modal");
	  logo.classList.add("game-logo");
	  button.classList.add("game-button");
	  this.logo = logo;
	  this.button = button;
	  this.modal = modal;
	};
	
	GameView.prototype.checkForGameOver = function () {
	  if (this._game.isGameOver()) {
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
	  this._game.restart();
	  var main = document.getElementById("main");
	  main.appendChild(this.modal);
	  this.modal.appendChild(this.logo);
	  this.modal.appendChild(this.button);
	  this.button.addEventListener("click", this.startGame.bind(this));
	};
	
	GameView.prototype.startGame = function () {
	  this.initialize = true;
	  var main = document.getElementById("main");
	  this.modal.removeChild(this.modal.firstChild);
	  this.modal.removeChild(this.modal.firstChild);
	  main.removeChild(this.modal);
	  this.button.removeEventListener("click", this.startGame.bind(this));
	  this.start();
	};
	
	GameView.prototype.throttlePausePlay = function () {
	  if (!this.stopped) {
	    this.togglePlay();
	    this.stopped = true;
	    window.setTimeout(this.unstop.bind(this), 600);
	  }
	};
	
	GameView.prototype.unstop = function () {
	  this.stopped = false;
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
	  } else if (keyCode === KEYCODES.space) {
	    return "space";
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
	      case "space":
	        that.throttlePausePlay();
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

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	
	function Coin(coord, size) {
	  options = { position: coord };
	  options.color = "#d6b52d";
	  options.radius = size;
	  options.velocity = { x: 0, y: 0 };
	  MovingObject.call(this, options);
	  this.frame = 1;
	}
	
	Util.inherit(Coin, MovingObject);
	
	Coin.prototype.ticksPerFrame = function () {
	  if (this.ticks <= 2) {
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
/* 9 */
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
	  this.ctx.clearRect(0, 0, this.spacer * 6, this.spacer * 3);
	  var offset = 0;
	  this.ticksPerFrame();
	  offset = this.frame * 44;
	  this.ctx.drawImage(document.getElementById('coin'), // sprite
	  0 + offset, // offset x
	  0, // offset y
	  44, // frameWidth
	  40, // frameHeight
	  0 + this.spacer / 2, // draw at x
	  0 + this.spacer / 2, // draw at y
	  this.spacer * 2, // actualWidth
	  this.spacer * 2 // actualHeight
	  );
	  this.ctx.fillStyle = "black";
	  this.ctx.font = "bold 4vh Courier New";
	  this.ctx.fillText(this.points, this.spacer * 3.2, this.spacer * 2);
	};
	
	module.exports = Score;

/***/ },
/* 10 */
/***/ function(module, exports) {

	function Timer(ctx, size) {
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
	  return mm + ":" + ss;
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
	  this.ctx.clearRect(0, 0, this.size * 6, this.size * 3);
	  var time = formatTime(this.startTime, this.pausedtime);
	
	  this.ctx.fillStyle = "black";
	  this.ctx.font = "bold 3vh Courier New";
	  this.ctx.textAlign = "center";
	  this.ctx.fillText(time, this.size * 3, this.size * 1.5);
	};
	
	module.exports = Timer;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map