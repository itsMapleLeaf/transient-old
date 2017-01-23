import * as pixi from 'pixi.js'
import * as songman from './song-manager'
import * as WebFontLoader from 'webfontloader'
import Game, {viewWidth, viewHeight} from './game'

function animationFrame(): Promise<number> {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve)
  })
}

function loadImages() {
  pixi.loader.add('note', require('../assets/note.svg'))
  pixi.loader.add('background', require('../assets/background.svg'))
  pixi.loader.add('receptor', require('../assets/receptor.svg'))
  pixi.loader.add('explosion', require('../assets/explosion.svg'))

  return new Promise((resolve, reject) => {
    pixi.loader.load()
      .on('load', res => console.log(`loading images (${ res.progress }%)`))
      .on('complete', resolve)
      .on('error', reject)
  })
}

function loadFonts() {
  return new Promise((resolve, reject) => {
    WebFontLoader.load({
      google: {
        families: ['Teko']
      },
      fontactive: font => console.log('loading fonts:', font),
      fontinactive: font => console.error('error loading font ', font),
      active: resolve,
      inactive: reject,
    })
  })
}

async function startGame() {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement
  const renderer = pixi.autoDetectRenderer(viewWidth, viewHeight, { view: canvas })
  const game = new Game()

  const interaction = new pixi.interaction.InteractionManager(renderer)
  interaction.on('pointerdown', game.pointerdown.bind(game))

  let time = await animationFrame()
  while (true) {
    const now = await animationFrame()
    const dt = (now - time) / 1000
    time = now
    game.update(dt)
    game.draw(renderer)
  }
}

async function main() {
  await loadImages()
  await loadFonts()
  await songman.loadSongs()
  await startGame()
}

main().catch(err => console.error(err))
