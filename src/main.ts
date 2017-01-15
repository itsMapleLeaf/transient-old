import {Game} from './game'
import {Gameplay} from './gameplay'
import {SongSelect} from './song-select'
import {canvas} from './graphics'

const game = new Game(new SongSelect())
let time = 0

window.requestAnimationFrame(function frame(now) {
  window.requestAnimationFrame(frame)

  const elapsed = (now - time) / 1000
  time = now

  game.update(elapsed)
  game.draw()
})

canvas.addEventListener('pointerdown', event => game.pointerdown(event as PointerEvent))
