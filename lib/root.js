var Game = require('./game');
var GameView = require('./game-view');

document.addEventListener("DOMContentLoaded", function () {
  var padding = 0.027, height, width;
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
  canvasScore.height= canvasTimer.height = spacer * 3;
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
