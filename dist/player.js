"use strict";
module.exports = player;
var clock = require('./clock');
var sequencer = require('./sequencer');
var osc = require('./osc');
function player(piece, options) {
  var clk = clock(options);
  var seq = sequencer(piece, options);
  clk.on('pulse', seq.advance);
  seq.on('*.*', function(data) {
    var topic = this.event;
    sendOSC(topic, data);
  });
  function play() {
    if (clk.running)
      return;
    clk.run();
  }
  function stop() {
    if (!clk.running)
      return;
    clk.stop();
  }
  function sendOSC(topic, ev) {
    var address = ("/" + topic.split('.').join('/'));
    var partName = topic.split('.')[0];
    var argNames = piece.$parts.find((function(p) {
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
  return {
    play: play,
    stop: stop
  };
}
