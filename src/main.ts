import * as pixi from 'pixi.js'
import * as WebFontLoader from 'webfontloader'
import Game, {viewWidth, viewHeight} from './game'

type SongData = {
  title: string
  artist: string
  art: string
  offset: number
  audio: string[]
  notes: [number, number][]
}

declare var require: any

function animationFrame(): Promise<number> {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve)
  })
}

function loadImages() {
  pixi.loader.add('note', require('../assets/images/note.svg'))
  pixi.loader.add('background', require('../assets/images/background.svg'))
  pixi.loader.add('receptor', require('../assets/images/receptor.svg'))
  pixi.loader.add('explosion', require('../assets/images/explosion.svg'))

  return new Promise((resolve, reject) => {
    pixi.loader.load(resolve).on('error', reject)
  })
}

function loadFonts() {
  return new Promise((resolve, reject) => {
    WebFontLoader.load({
      google: {
        families: ['Teko']
      },
      active: resolve,
      inactive: reject,
    })
  })
}

function loadSongs() {
  const context = require.context('../songs', true, /song\.yaml/)
  for (const file of context.keys() as string[]) {
    const data = context(file)
    console.log(data)
  }
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
  await loadSongs()
  await startGame()
}

main().catch(err => console.error(err))
