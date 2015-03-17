module.exports = createSequencer;

let EventEmitter = require('eventemitter2').EventEmitter2;

function createSequencer(piece, { ppqn = 24 } = {}) {
  
  let _positionInTicks = 0;
  const TICK_LENGTH_IN_NOTES = 1 / (ppqn * 4);
  const emitter = new EventEmitter({
    wildcard: true
  });

  // Public

  function advance() {
    let self = this;
    piece.$parts.forEach(part => {
      let phrase = part.phrases[0];
      let loopPosInTicks = _positionInTicks % getTicksFromTimeObj({ bars: 1 });
      let events = getEventsFromPhraseAtLoopPos(phrase, loopPosInTicks);
      if(events && events.length) {
        events.forEach(ev => {
          emitter.emit(`${ part.name }.${ ev.type }`, ev);
        });
      }
    });
    _positionInTicks++;
    return this;
  }

  function on(...args) {
    return emitter.on(...args);
  }

  // Private

  function getTicksFromTimeObj(obj) {
    let totalBeats = ((obj.bars || 0) * 4) + (obj.beats || 0);
    return totalBeats * ppqn;
  }

  function getEventsFromPhraseAtLoopPos(phrase, loopPosInTicks) {
    let loopPosInNotes = loopPosInTicks * TICK_LENGTH_IN_NOTES;
    return phrase
      .occs
      .filter(occ => occ.pos === loopPosInNotes)
      .map(occ => occ.ev);
  }

  return { advance, on };

}