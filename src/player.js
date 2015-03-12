'use strict';

let {
  create,
  where
} = require('lodash');
let EventEmitter = require('eventemitter2').EventEmitter2;

let _resolution = 24; // ppqn

function createPlayer(score) {
  let _positionInTicks = 0;
  const TICK_LENGTH_IN_NOTES = 1 / (_resolution * 4);

  // Public

  function tick() {
    let self = this;
    score.parts.forEach(part => {
      let phrase = part.phrases[0];
      let loopPosInTicks = _positionInTicks % getTicksFromTimeObj({ bars: 1 });
      let events = getEventsFromPhraseAtLoopPos(phrase, loopPosInTicks);
      if(events && events.length) {
        events.forEach(ev => {
          self.emit(`${ part.name }.${ ev.type }`, ev);
        });
      }
    });
    _positionInTicks++;
    return this;
  }

  // Private

  function getTicksFromTimeObj(obj) {
    let totalBeats = ((obj.bars || 0) * 4) + (obj.beats || 0);
    return totalBeats * _resolution;
  }

  function getEventsFromPhraseAtLoopPos(phrase, loopPosInTicks) {
    let loopPosInNotes = loopPosInTicks * TICK_LENGTH_IN_NOTES;
    return phrase
      .occs
      .filter(occ => occ.pos === loopPosInNotes)
      .map(occ => occ.ev);
  }

  return create(EventEmitter.prototype, {
    tick
  });

}

module.exports = {
  createPlayer,
  set resolution(value) { _resolution = value; }
};