import * as pixi from 'pixi.js'
import {Game, viewWidth, viewHeight} from './game'

const canvas = document.querySelector('canvas') as HTMLCanvasElement

const renderer = pixi.autoDetectRenderer(viewWidth, viewHeight, {
  view: canvas,
  backgroundColor: 0
})

const game = new Game(renderer)

let time = 0
let elapsed

window.requestAnimationFrame(function frame(now) {
  elapsed = (now - time) / 1000
  time = now
  game.update(elapsed)
  window.requestAnimationFrame(frame)
})
