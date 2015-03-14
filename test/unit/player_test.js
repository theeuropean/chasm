"use strict";

var h = require('../test_helper');
var sinon = require('sinon');
var _ = require('lodash');
var player = require('../../dist/player');
var createPlayer = player.createPlayer;

describe('player', function () {

  player.resolution = 4; // set default resolution to 16ths

  it("can create a player", function () {
    createPlayer().should.exist;
  });

  it("can play a simple piece", function () {
    var n1 = { type: 'note', data: { pitch: 1 } };
    // var score = {
    //   sections: [{ strains: [{ phrases: [{ occs: [
    //     // x--- ---- x--- ----
    //     { pos: 0,   ev: n1 },
    //     { pos: 1/2, ev: n1 }
    //   ] }], part: { name: 'foo' } }] }]
    // };
    var piece = {
      $parts: [
        {
          name: 'foo',
          phrases: [
            {
              occs: [
                // x--- ---- x--- ----
                { pos: 0,   ev: n1 },
                { pos: 1/2, ev: n1 }
              ]
            }
          ]
        }
      ]
    };
    var p = createPlayer(piece);
    var spy = sinon.spy();
    p.on('foo.note', spy);
    
    p.tick(); // 0 of 16 = note
    spy.should.have.callCount(1);
    p.tick(); // 1 of 16 = no note
    spy.should.have.callCount(1);
    _.times(6, p.tick); // 2-7 of 16 = no note
    spy.should.have.callCount(1);
    p.tick(); // 8 of 16 = note
    spy.should.have.callCount(2);
    _.times(7, p.tick); // 9-15 of 16 = no note
    spy.should.have.callCount(2);
    p.tick(); // 16 of 16 = 0 of 16 = note
    spy.should.have.callCount(3);
    spy.should.always.have.been.calledWith(n1);
  });

});