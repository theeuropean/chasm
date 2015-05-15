const { isString, isObject } = require('lodash')
const glob = require('glob')
const Piece = require('./piece')
const player = require('./player')

const pieces = new Map()
const customPieceMethods = new Map()
let currentPlayer
let currentChasmFile

function loadChasmFiles(cwd) {
  let files = glob.sync('*.chasm.js')
  for(let file of files) {
    let path = `${ cwd }/${ file }`
    console.log(`loading ${ path } ...`)
    currentChasmFile = file.split('.chasm.js')[0]
    require(path)
    currentChasmFile = null
  }
}

function addPieceMethod(name, fn) {
  customPieceMethods.set(name, fn)
}

function piece(name = currentChasmFile || `piece${ pieces.size }`) {
  console.log(`adding piece ${ name } ...`)
  return pieces.get(name) || addPiece(name)
}

function play({ name, options } = {}) {
  name = name || Array.from(pieces.keys())[0]
  options = options || {}
  console.log(`playing piece ${ name } ...`)
  if(currentPlayer) {
    stop()
  }
  let script = pieces.get(name).script
  currentPlayer = player(script, options)
  currentPlayer.play()
}

function stop() {
  if(currentPlayer) {
    currentPlayer.stop()
    currentPlayer = null
  }
}

function addPiece(name) {
  const p = Piece(name)
  for(let [n, fn] of customPieceMethods) {
    p[n] = fn.bind(p, p)
  }
  pieces.set(name, p)
  return p
}

module.exports = { loadChasmFiles, addPieceMethod, piece, play, stop }