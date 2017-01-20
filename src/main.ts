import {viewWidth, viewHeight} from './constants'
import * as pixi from 'pixi.js'
import * as WebFontLoader from 'webfontloader'
import Game from './Game'
import Gameplay from './gamestates/Gameplay'

function start()  {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement

  const renderer = pixi.autoDetectRenderer(viewWidth, viewHeight, {
    view: canvas,
    backgroundColor: 0
  })

  const game = new Game(renderer, new Gameplay())

  window.requestAnimationFrame(function frame(now: number, time = 0) {
    const elapsed = (now - time) / 1000
    time = now
    game.update(elapsed)
    game.render()
    window.requestAnimationFrame(now => frame(now, time))
  })
}

WebFontLoader.load({
  google: {
    families: ['Teko']
  },
  active: start,
  loading() {
    console.log('Loading fonts...')
  }
})
