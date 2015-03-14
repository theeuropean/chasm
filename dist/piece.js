"use strict";
"use strict";
var sortBy = require('lodash').sortBy;
module.exports = {createPiece: createPiece};
function createPiece() {
  var _lastPart;
  var _lastPhrase;
  var _parts = [];
  return {
    part: part,
    phrase: phrase,
    ev: ev,
    gr: gr,
    $parts: _parts
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
}
