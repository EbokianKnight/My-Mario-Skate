var Game = require('./game');
var GameView = require('./game-view');

document.addEventListener("DOMContentLoaded", function () {
  var spacer = 0.025, height, width;
  if (window.innerHeight > window.innerWidth) {
    spacer = spacer * window.innerHeight;
    height = spacer * 34;
    width = spacer * 20;
  } else {
    spacer = spacer * window.innerWidth;
    height = spacer * 20;
    width = spacer * 34;
  }


  var canvasEl = document.getElementById("ctx");
  var canvasIce = document.getElementById("ctx-ice");
  canvasEl.height = canvasIce.height = height;
  canvasEl.width = canvasIce.width = width;

  var ctx = canvasEl.getContext("2d");
  var ctx2 = canvasIce.getContext("2d");
  var game = new Game(ctx2, width, height, spacer);

  var view = new GameView(game, ctx);
  view.bindKeyHandlers();
  view.start();
});
