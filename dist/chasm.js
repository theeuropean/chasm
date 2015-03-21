"use strict";
module.exports = {
  piece: piece,
  play: play,
  stop: stop
};
var createPiece = require('./piece');
var player = require('./player');
var pieces = new Map();
var currentPlayer;
function piece(name) {
  return pieces.get(name) || addPiece(name);
}
function play(name, options) {
  if (currentPlayer) {
    stop();
  }
  var p = pieces.get(name);
  currentPlayer = player(p, options);
  currentPlayer.play();
}
function stop() {
  if (currentPlayer) {
    currentPlayer.stop();
    currentPlayer = null;
  }
}
function addPiece(name) {
  var p = createPiece();
  pieces.set(name, p);
  return p;
}
