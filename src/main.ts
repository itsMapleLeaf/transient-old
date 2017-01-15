import {Game} from './game'

const game = new Game()
let time = 0

window.requestAnimationFrame(function frame(now) {
  window.requestAnimationFrame(frame)

  const elapsed = (now - time) / 1000
  time = now

  game.update(elapsed)
  game.draw()
})

window.addEventListener('pointerdown', event => game.pointerdown(event as PointerEvent))
