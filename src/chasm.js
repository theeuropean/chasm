module.exports = {
  piece,
  play,
  stop
};

const _ = require('lodash');
const createPiece = require('./piece');
const clock = require('./clock');
const sequencer = require('./sequencer');
const osc = require('./osc');

let pieces = new Map();
let currentClock;

function piece(name) {
  return pieces.get(name) || addPiece(name);
}

function play(name, options) {
  if(currentClock) {
    currentClock.stop();
  }
  let p = pieces.get(name);
  let c = clock({}, options);
  let s = sequencer(p, options);
  c.on('pulse', s.advance);
  s.on('*.*', function (data) {
    let topic = this.event;
    sendOSC(p, topic, data);
  });
  c.run();
  currentClock = c;
}

function stop() {
  if(currentClock) {
    currentClock.stop();
    currentClock = null;
  }  
}

function sendOSC(_piece, topic, ev) {
  let partName = topic.split('.')[0];
  let address = `/${ partName }/${ ev.type }`;
  let argNames = _piece
    .$parts
    .find(p => p.name === partName)
    .dest
    .argNames;
  let args = argNames.map(an => ev.data[an]);
  osc.send({
    address: address,
    args: args,
    udpAddress: 'localhost',
    port: 24276
  });
}

function addPiece(name) {
  let p = createPiece();
  pieces.set(name, p);
  return p;
}