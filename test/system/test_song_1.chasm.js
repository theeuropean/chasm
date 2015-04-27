const { part, phrase, gr, toOSC } = require('../../src/chasm').piece()

part(
  phrase(
    gr('x--- x--- x--- x---', 1)
  ),
  toOSC('', 'pitch')
)