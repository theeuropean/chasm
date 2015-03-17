module.exports = createPiece;

// ES6 object destructuring FTW
const {
  sortBy
} = require('lodash');

function createPiece() {

  let _lastPart;
  let _lastPhrase;
  let _parts = [];
  // let _sections = [];
  // let _score = {
  //   parts: _parts
  //   // get sections() {
  //   //   return _sections.length ?
  //   //     _sections : 
  //   //     [getDefaultSection()];
  //   // }
  // };

  return {
    part, 
    phrase, 
    ev, 
    gr,
    toOSC,
    $parts: _parts
  };

  // Public

  function part(name = `part${ _parts.length }`) {
    _lastPart = { name, phrases: [] };
    _parts.push(_lastPart);
    return this;
  }

  function phrase(name = `phrase${ _lastPart.phrases.length }`) {
    _lastPhrase = { name, occs: [] };
    _lastPart.phrases.push(_lastPhrase);
    return this;
  }

  function ev(pos, type, data) {
    let occs = _lastPhrase.occs;
    occs.push({ pos, ev: { type, data } });
    _lastPhrase.occs = sortBy(occs, 'pos');
    return this;
  }

  function gr(patt, nn) {
    patt
      .replace(/ /g, '')
      .split('')
      .forEach((chr, i) => {
        if(chr === 'x') {
          ev(i * (1/16), 'note', { pitch: nn });
        }
      });
    return this;
  }

  function toOSC(address, ...argNames) {
    _lastPart.dest = { address, argNames };
    return this;
  }

  // Private

  // Getting ahead of myself
  // function getDefaultSection() {
  //   return {
  //     name: 'section0',
  //     strains: _parts.map(part => { 
  //       return { part, phrases: [part.phrases[0]] };
  //     })
  //   };
  // }

}