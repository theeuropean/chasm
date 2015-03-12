"use strict";

var chai = require('chai');
var createSong = require('../dist/song.js').createSong;
chai.should();

describe('song', function () {

  it("exposes its public data via a score property", function () {
    createSong().$score.should.exist;
  });

  it("can add a part with default or specified name", function () {
    createSong().part().$score.parts[0]
      .should.exist;
    createSong().part().$score.parts[0].name
      .should.equal('part0');
    createSong().part('foo').$score.parts[0].name
      .should.equal('foo');
  });

  it("can add a phrase to a part with default or specified name", function () {
    createSong().part().phrase().$score.parts[0].phrases[0]
      .should.exist;
    createSong().part().phrase().$score.parts[0].phrases[0].name
      .should.equal('phrase0');
    createSong().part().phrase('foo').$score.parts[0].phrases[0].name
      .should.equal('foo');
  });

  it('can add an event occurrence to a phrase', function () {
    createSong()
      .part().phrase()
        .ev(0, 'note', { pitch: 1 })
      .$score.parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0, ev: { type: 'note', data: { pitch: 1 } } }
      ]);
  });

  it('should order phrase event occurrences by position', function () {
    createSong()
      .part().phrase()
        .ev(1/2, 'note', { pitch: 2 })
        .ev(0,   'note', { pitch: 1 })
      .$score.parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0,   ev: { type: 'note', data: { pitch: 1 } } },
        { pos: 1/2, ev: { type: 'note', data: { pitch: 2 } } }
      ]);
  });

  it('should allow creation of a phrase from a grid pattern', function () {
    var nn1 = { type: 'note', data: { pitch: 1 } };
    createSong().part().phrase()
      .gr('x--- x--- x--- x---', 1)
      .$score.parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0/4, ev: nn1 },
        { pos: 1/4, ev: nn1 },
        { pos: 2/4, ev: nn1 },
        { pos: 3/4, ev: nn1 }
      ]);
  });

  // Getting ahead of myself...
  // it("should expose a default section when none has been specified", function () {
  //   var score = createSong().part().phrase().$score;
  //   score.sections[0].strains[0]
  //     .should.deep.equal({
  //       part: score.parts[0],
  //       phrases: [score.parts[0].phrases[0]]
  //     });
  // });

});