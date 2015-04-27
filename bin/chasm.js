#!/usr/bin/env babel-node
const Liftoff = require('liftoff')

const cli = new Liftoff({
  name: 'chasm',
  configName: 'chasmconf'
})

cli.launch({}, invoke)

function invoke(env) {
  let cwd = process.cwd()
  console.log(`loading ${ env.configPath } ...`)
  require(env.configPath)
  let chasm = require(env.modulePath)
  chasm.loadChasmFiles(cwd)
  chasm.play('test_song_1')
}