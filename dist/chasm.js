"use strict";
module.exports = {
  piece: piece,
  play: play,
  stop: stop
};
var _ = require('lodash');
var createPiece = require('./piece');
var clock = require('./clock');
var sequencer = require('./sequencer');
var osc = require('./osc');
var pieces = new Map();
var currentClock;
function piece(name) {
  return pieces.get(name) || addPiece(name);
}
function play(name, options) {
  if (currentClock) {
    currentClock.stop();
  }
  var p = pieces.get(name);
  var c = clock({}, options);
  var s = sequencer(p, options);
  c.on('pulse', s.advance);
  s.on('*.*', function(data) {
    var topic = this.event;
    sendOSC(p, topic, data);
  });
  c.run();
  currentClock = c;
}
function stop() {
  if (currentClock) {
    currentClock.stop();
    currentClock = null;
  }
}
function sendOSC(_piece, topic, ev) {
  var partName = topic.split('.')[0];
  var address = ("/" + partName + "/" + ev.type);
  var argNames = _piece.$parts.find((function(p) {
    return p.name === partName;
  })).dest.argNames;
  var args = argNames.map((function(an) {
    return ev.data[an];
  }));
  osc.send({
    address: address,
    args: args,
    udpAddress: 'localhost',
    port: 24276
  });
}
function addPiece(name) {
  var p = createPiece();
  pieces.set(name, p);
  return p;
}
