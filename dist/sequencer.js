"use strict";
module.exports = createSequencer;
var EventEmitter = require('eventemitter2').EventEmitter2;
function createSequencer(piece) {
  var $__2;
  var $__1 = arguments[1] !== (void 0) ? arguments[1] : {},
      ppqn = ($__2 = $__1.ppqn) === void 0 ? 24 : $__2;
  var _positionInTicks = 0;
  var TICK_LENGTH_IN_NOTES = 1 / (ppqn * 4);
  var emitter = new EventEmitter({wildcard: true});
  function advance() {
    var self = this;
    piece.$parts.forEach((function(part) {
      var phrase = part.phrases[0];
      var loopPosInTicks = _positionInTicks % getTicksFromTimeObj({bars: 1});
      var events = getEventsFromPhraseAtLoopPos(phrase, loopPosInTicks);
      if (events && events.length) {
        events.forEach((function(ev) {
          emitter.emit((part.name + "." + ev.type), ev);
        }));
      }
    }));
    _positionInTicks++;
    return this;
  }
  function on() {
    var $__3;
    for (var args = [],
        $__0 = 0; $__0 < arguments.length; $__0++)
      args[$__0] = arguments[$__0];
    return ($__3 = emitter).on.apply($__3, $traceurRuntime.spread(args));
  }
  function getTicksFromTimeObj(obj) {
    var totalBeats = ((obj.bars || 0) * 4) + (obj.beats || 0);
    return totalBeats * ppqn;
  }
  function getEventsFromPhraseAtLoopPos(phrase, loopPosInTicks) {
    var loopPosInNotes = loopPosInTicks * TICK_LENGTH_IN_NOTES;
    return phrase.occs.filter((function(occ) {
      return occ.pos === loopPosInNotes;
    })).map((function(occ) {
      return occ.ev;
    }));
  }
  return {
    advance: advance,
    on: on
  };
}
