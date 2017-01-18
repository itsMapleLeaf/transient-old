import * as pixi from 'pixi.js'
import {Game, viewWidth, viewHeight} from './game'
import {Gameplay} from './gameplay'

const canvas = document.querySelector('canvas') as HTMLCanvasElement

const renderer = pixi.autoDetectRenderer(viewWidth, viewHeight, {
  view: canvas,
  backgroundColor: 0
})

const game = new Game(renderer, new Gameplay())

let time = 0

window.requestAnimationFrame(function frame(now) {
  const elapsed = (now - time) / 1000
  time = now
  game.update(elapsed)
  game.render()
  window.requestAnimationFrame(frame)
})
