import {viewWidth, viewHeight} from './constants'
import * as pixi from 'pixi.js'
import * as WebFontLoader from 'webfontloader'
import {Game} from './game'
import Gameplay from './gamestates/Gameplay'

function loadFonts(families: string[]): Promise<{}> {
  return new Promise((resolve, reject) => {
    WebFontLoader.load({
      google: { families },
      active: resolve,
      inactive: reject
    })
  })
}

function animationFrame(): Promise<number> {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve)
  })
}

async function main() {
  await loadFonts(['Teko'])

  const canvas = document.querySelector('canvas') as HTMLCanvasElement

  const renderer = pixi.autoDetectRenderer(viewWidth, viewHeight, {
    view: canvas,
    backgroundColor: 0
  })

  const game = new Game(renderer, new Gameplay())
  let time = await animationFrame()

  while (true) {
    const now = await animationFrame()
    const elapsed = (now - time) / 1000
    time = now
    game.update(elapsed)
  }
}

main().catch(console.error.bind(console))
