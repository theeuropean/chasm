"use strict";
module.exports = {send: send};
var osc = require('osc-min');
var udp = require('./udp');
function send($__0) {
  var $__1 = $__0,
      address = $__1.address,
      args = $__1.args,
      port = $__1.port,
      udpAddress = $__1.udpAddress;
  var buf = osc.toBuffer({
    address: address,
    args: args
  });
  return udp.send({
    buf: buf,
    port: port,
    address: udpAddress
  });
}
