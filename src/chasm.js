module.exports = {
  piece,
  play,
  stop
};

const createPiece = require('./piece');
const player = require('./player');

let pieces = new Map();
let currentPlayer;

function piece(name) {
  return pieces.get(name) || addPiece(name);
}

function play(name, options) {
  if(currentPlayer) {
    stop();
  }
  let p = pieces.get(name);
  currentPlayer = player(p, options);
  currentPlayer.play();
}

function stop() {
  if(currentPlayer) {
    currentPlayer.stop();
    currentPlayer = null;
  }  
}

function addPiece(name) {
  let p = createPiece();
  pieces.set(name, p);
  return p;
}