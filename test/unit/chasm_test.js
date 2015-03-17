'use strict';

var h = require('../test_helper');
var proxyquire = require('proxyquire');
var chasm = proxyquire('../../dist/chasm', { './clock': mockClock });

describe('chasm', function () {

  it('can add a piece', function () {
    chasm.piece('My_Awesome_Song').part('foo');
    chasm.piece('My_Awesome_Song').$parts[0].name
      .should.equal('foo');
  });

  // it('can play a piece', function () {
  //   chasm.piece('My_Awesome_Song');
  //   chasm.play('My_Awesome_Song');
  // });

});

function mockClock() {

}