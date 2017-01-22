import * as pixi from 'pixi.js'
import Game, {viewWidth, viewHeight} from './game'

function startGame() {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement
  const renderer = pixi.autoDetectRenderer(viewWidth, viewHeight, { view: canvas })
  const interaction = new pixi.interaction.InteractionManager(renderer)

  const game = new Game()
  let time = 0

  window.requestAnimationFrame(function gameloop(now) {
    const dt = (now - time) / 1000
    time = now

    game.update(dt)
    game.draw(renderer)
    window.requestAnimationFrame(gameloop)
  })

  interaction.on('pointerdown', game.pointerdown.bind(game))
}

function loadResources() {
  pixi.loader.add('note', require('../assets/images/note.svg'))
  pixi.loader.add('background', require('../assets/images/background.svg'))
  pixi.loader.add('receptor', require('../assets/images/receptor.svg'))
  pixi.loader.add('explosion', require('../assets/images/explosion.svg'))
  pixi.loader.load(startGame).on('error', err => console.error(err))
}

loadResources()
