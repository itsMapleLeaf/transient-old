import * as pixi from 'pixi.js'
import {Game, viewWidth, viewHeight} from './game'

function animationFrame(): Promise<number> {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve)
  })
}

function loadAssets(): Promise<pixi.loaders.Loader> {
  return new Promise((resolve, reject) => {
    pixi.loader.add('note', require('../assets/images/note.svg'))
    pixi.loader.add('background', require('../assets/images/background.svg'))
    pixi.loader.add('note-receptor', require('../assets/images/note-receptor.svg'))
    pixi.loader.load(resolve)
  })
}

async function main() {
  await loadAssets()

  const view = document.querySelector('canvas') as HTMLCanvasElement
  const renderer = pixi.autoDetectRenderer(viewWidth, viewHeight, { view })
  const game = new Game(renderer)

  let time = await animationFrame()

  while (true) {
    const now = await animationFrame()
    const elapsed = (now - time) / 1000
    time = now

    game.update(elapsed)
    game.draw()
  }
}

main().catch(console.error.bind(console))
