var Game = require('./game');
var GameView = require('./game-view');
var bloc, height, width;

document.addEventListener("DOMContentLoaded", function () {
  if (window.innerHeight > window.innerWidth) {
    bloc = Math.floor(document.getElementById("main").offsetWidth / 64);
    height = bloc * 92;
    width = bloc * 64;
    console.log(document.getElementById("main"));
    console.log(height);
    console.log(width);
  } else {
    bloc = Math.floor(document.getElementById("main").offsetWidth / 92);
    height = bloc * 64;
    width = bloc * 92;
    console.log(document.getElementById("main"));
    console.log(height);
    console.log(width);
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
