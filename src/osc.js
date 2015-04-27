const osc = require('osc-min');
const udp = require('./udp');

function send({ address, args, port, udpAddress }) {
  let buf = osc.toBuffer({ address, args });
  return udp.send({ buf, port, address: udpAddress });
}

export { send }