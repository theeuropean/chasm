"use strict";

var h = require('../test_helper');
var piece = require('../../dist/piece');

describe('piece', function () {

  it("exposes its parts (fnar fnar)", function () {
    piece().$parts.should.exist;
  });

  it("can add a part with default or specified name", function () {
    piece().part().$parts[0]
      .should.exist;
    piece().part().$parts[0].name
      .should.equal('part0');
    piece().part('foo').$parts[0].name
      .should.equal('foo');
  });

  it("can add a phrase to a part with default or specified name", function () {
    piece().part().phrase().$parts[0].phrases[0]
      .should.exist;
    piece().part().phrase().$parts[0].phrases[0].name
      .should.equal('phrase0');
    piece().part().phrase('foo').$parts[0].phrases[0].name
      .should.equal('foo');
  });

  it('can add an event occurrence to a phrase', function () {
    piece()
      .part().phrase()
        .ev(0, 'note', { pitch: 1 })
      .$parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0, ev: { type: 'note', data: { pitch: 1 } } }
      ]);
  });

  it('should order phrase event occurrences by position', function () {
    piece()
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
    piece().part().phrase()
      .gr('x--- x--- x--- x---', 1)
      .$parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0/4, ev: nn1 },
        { pos: 1/4, ev: nn1 },
        { pos: 2/4, ev: nn1 },
        { pos: 3/4, ev: nn1 }
      ]);
  });

  it('should allow setting an OSC destination', function () {
    var dest = piece().part().toOSC('/foo', 'bar', 'baz')
      .$parts[0].dest;
    dest.address.should.equal('/foo');
    dest.argNames.should.deep.equal(['bar', 'baz']);
  });

  // Getting ahead of myself...
  // it("should expose a default section when none has been specified", function () {
  //   var score = piece().part().phrase().$score;
  //   score.sections[0].strains[0]
  //     .should.deep.equal({
  //       part: score.parts[0],
  //       phrases: [score.parts[0].phrases[0]]
  //     });
  // });

});