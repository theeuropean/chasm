"use strict";
"use strict";
var sortBy = require('lodash').sortBy;
module.exports = {createSong: createSong};
function createSong() {
  var _lastPart;
  var _lastPhrase;
  var _parts = [];
  var _sections = [];
  var _score = {
    parts: _parts,
    get sections() {
      return _sections.length ? _sections : [getDefaultSection()];
    }
  };
  return {
    part: part,
    phrase: phrase,
    ev: ev,
    gr: gr,
    $score: _score
  };
  function part() {
    var name = arguments[0] !== (void 0) ? arguments[0] : ("part" + _parts.length);
    _lastPart = {
      name: name,
      phrases: []
    };
    _parts.push(_lastPart);
    return this;
  }
  function phrase() {
    var name = arguments[0] !== (void 0) ? arguments[0] : ("phrase" + _lastPart.phrases.length);
    _lastPhrase = {
      name: name,
      occs: []
    };
    _lastPart.phrases.push(_lastPhrase);
    return this;
  }
  function ev(pos, type, data) {
    var occs = _lastPhrase.occs;
    occs.push({
      pos: pos,
      ev: {
        type: type,
        data: data
      }
    });
    _lastPhrase.occs = sortBy(occs, 'pos');
    return this;
  }
  function gr(patt, nn) {
    patt.replace(/ /g, '').split('').forEach((function(chr, i) {
      if (chr === 'x') {
        ev(i * (1 / 16), 'note', {pitch: nn});
      }
    }));
    return this;
  }
  function getDefaultSection() {
    return {
      name: 'section0',
      strains: _parts.map((function(part) {
        return {
          part: part,
          phrases: [part.phrases[0]]
        };
      }))
    };
  }
}
