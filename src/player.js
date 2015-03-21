module.exports = player;

const clock = require('./clock');
const sequencer = require('./sequencer');
const osc = require('./osc');

function player(piece, options) {

  const clk = clock(options);
  const seq = sequencer(piece, options);
  clk.on('pulse', seq.advance);
  seq.on('*.*', function (data) {
    let topic = this.event;
    sendOSC(topic, data);
  });

  function play() {
    if(clk.running) return;
    clk.run();
  }

  function stop() {
    if(!clk.running) return;
    clk.stop();
  }

  function sendOSC(topic, ev) {
    let address = `/${ topic.split('.').join('/') }`;
    let partName = topic.split('.')[0];
    let argNames = piece
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

  return { play, stop };

}