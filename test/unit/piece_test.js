"use strict";

var h = require('../test_helper');
var createPiece = require('../../dist/piece').createPiece;

describe('piece', function () {

  it("exposes its parts (fnar fnar)", function () {
    createPiece().$parts.should.exist;
  });

  it("can add a part with default or specified name", function () {
    createPiece().part().$parts[0]
      .should.exist;
    createPiece().part().$parts[0].name
      .should.equal('part0');
    createPiece().part('foo').$parts[0].name
      .should.equal('foo');
  });

  it("can add a phrase to a part with default or specified name", function () {
    createPiece().part().phrase().$parts[0].phrases[0]
      .should.exist;
    createPiece().part().phrase().$parts[0].phrases[0].name
      .should.equal('phrase0');
    createPiece().part().phrase('foo').$parts[0].phrases[0].name
      .should.equal('foo');
  });

  it('can add an event occurrence to a phrase', function () {
    createPiece()
      .part().phrase()
        .ev(0, 'note', { pitch: 1 })
      .$parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0, ev: { type: 'note', data: { pitch: 1 } } }
      ]);
  });

  it('should order phrase event occurrences by position', function () {
    createPiece()
      .part().phrase()
        .ev(1/2, 'note', { pitch: 2 })
        .ev(0,   'note', { pitch: 1 })
      .$parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0,   ev: { type: 'note', data: { pitch: 1 } } },
        { pos: 1/2, ev: { type: 'note', data: { pitch: 2 } } }
      ]);
  });

  it('should allow creation of a phrase from a grid pattern', function () {
    var nn1 = { type: 'note', data: { pitch: 1 } };
    createPiece().part().phrase()
      .gr('x--- x--- x--- x---', 1)
      .$parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0/4, ev: nn1 },
        { pos: 1/4, ev: nn1 },
        { pos: 2/4, ev: nn1 },
        { pos: 3/4, ev: nn1 }
      ]);
  });

  // Getting ahead of myself...
  // it("should expose a default section when none has been specified", function () {
  //   var score = createPiece().part().phrase().$score;
  //   score.sections[0].strains[0]
  //     .should.deep.equal({
  //       part: score.parts[0],
  //       phrases: [score.parts[0].phrases[0]]
  //     });
  // });

});