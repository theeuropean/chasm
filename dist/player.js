"use strict";
'use strict';
var $__0 = require('lodash'),
    create = $__0.create,
    where = $__0.where;
var EventEmitter = require('eventemitter2').EventEmitter2;
var _resolution = 24;
function createPlayer(piece) {
  var _positionInTicks = 0;
  var TICK_LENGTH_IN_NOTES = 1 / (_resolution * 4);
  function tick() {
    var self = this;
    piece.$parts.forEach((function(part) {
      var phrase = part.phrases[0];
      var loopPosInTicks = _positionInTicks % getTicksFromTimeObj({bars: 1});
      var events = getEventsFromPhraseAtLoopPos(phrase, loopPosInTicks);
      if (events && events.length) {
        events.forEach((function(ev) {
          self.emit((part.name + "." + ev.type), ev);
        }));
      }
    }));
    _positionInTicks++;
    return this;
  }
  function getTicksFromTimeObj(obj) {
    var totalBeats = ((obj.bars || 0) * 4) + (obj.beats || 0);
    return totalBeats * _resolution;
  }
  function getEventsFromPhraseAtLoopPos(phrase, loopPosInTicks) {
    var loopPosInNotes = loopPosInTicks * TICK_LENGTH_IN_NOTES;
    return phrase.occs.filter((function(occ) {
      return occ.pos === loopPosInNotes;
    })).map((function(occ) {
      return occ.ev;
    }));
  }
  return create(EventEmitter.prototype, {tick: tick});
}
module.exports = {
  createPlayer: createPlayer,
  set resolution(value) {
    _resolution = value;
  }
};
