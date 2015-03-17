"use strict";

var h = require('../test_helper');
var sinon = require('sinon');
var _ = require('lodash');
var sequencer = require('../../dist/sequencer');

describe('sequencer', function () {

  it("can create a sequencer", function () {
    sequencer().should.exist;
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
    var s = sequencer(piece, { ppqn: 4 });
    var spy = sinon.spy();
    s.on('foo.note', spy);
    
    s.advance(); // 0 of 16 = note
    spy.should.have.callCount(1);
    s.advance(); // 1 of 16 = no note
    spy.should.have.callCount(1);
    _.times(6, s.advance); // 2-7 of 16 = no note
    spy.should.have.callCount(1);
    s.advance(); // 8 of 16 = note
    spy.should.have.callCount(2);
    _.times(7, s.advance); // 9-15 of 16 = no note
    spy.should.have.callCount(2);
    s.advance(); // 16 of 16 = 0 of 16 = note
    spy.should.have.callCount(3);
    spy.should.always.have.been.calledWith(n1);
  });

});