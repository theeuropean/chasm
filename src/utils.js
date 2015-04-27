module.exports = { getChord: getChord };

var piu = require('piu');
var teoria = require('teoria');

function getChord(arrayOfMIDINotes) {
  var notes = arrayOfMIDINotes.map(teoria.note.fromMIDI);
  return piu.infer(notes).map(piu.name);
}