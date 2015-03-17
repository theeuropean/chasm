"use strict";
module.exports = {send: send};
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
function send($__0) {
  var $__1 = $__0,
      buf = $__1.buf,
      address = $__1.address,
      port = $__1.port;
  return client.send(buf, 0, buf.length, port, address);
}
