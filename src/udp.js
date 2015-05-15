const dgram = require('dgram');

const client = dgram.createSocket('udp4');

function send({ buf, address, port }) {
  return client.send(buf, 0, buf.length, port, address);
}

module.exports = { send };