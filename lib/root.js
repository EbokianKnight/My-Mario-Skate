var Game = require('./game');
var GameView = require('./game-view');
var bloc, height, width;

document.addEventListener("DOMContentLoaded", function () {
  if (window.innerHeight > window.innerWidth) {
    size = document.getElementById("main").offsetWidth;
    if( !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
     size = size > 450 ? 450 : size;
   }
    bloc =  size / 64;
    height = bloc * 92;
    width = bloc * 64;
  } else {
    size = document.getElementById("main").offsetWidth;
    if( !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
     size = size > 900 ? 900 : size;
   }
    bloc =  size / 92;
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
