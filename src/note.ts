import {Color} from './color'
import {Drawable, Animation} from './game'
import {Point} from './point'
import * as game from './game'
import * as graphics from './graphics'
import * as util from './util'

export enum NoteState {
  active,
  hit,
  missed,
  holding,
}

export class Note implements Drawable {
  state = NoteState.active

  constructor(public time: number, public position: number) {}

  getScreenPosition(): Point {
    const x = util.lerp(game.trackLeft, game.viewWidth - game.trackRight, this.position)
    const y = util.lerp(game.receptorPosition, game.receptorPosition - game.noteSpacing, this.time)
    return new Point(x, y)
  }

  draw(c: CanvasRenderingContext2D) {
    const pos = this.getScreenPosition()
    graphics.applyCenteredRotation(45, pos, c, () => {
      graphics.rectangle(c, -25, -25, 50).fill(Color.white)
      graphics.rectangle(c, -30, -30, 60).stroke(Color.white.fade(0.7), 2)
    })
  }
}

export class NoteHitAnimation implements Animation {
  time = 0

  constructor(public pos: Point) {}

  update(dt: number): this {
    this.time += dt * 2
    return this
  }

  isFinished(): boolean {
    return this.time >= 1
  }

  draw(c: CanvasRenderingContext2D) {
    const drift = this.time ** 2 * 200
    const opacity = 1 - util.clamp(this.time, 0, 1) ** 1.7
    const glowAmount = (1 - this.time ** 2) * 75

    const pos = this.pos.add(new Point(0, drift))
    const glowColor = Color.white.fade(opacity)

    graphics.applyShadow(c, glowColor, glowAmount, 0, 0, () => {
      graphics.applyCenteredRotation(45, pos, c, () => {
        graphics.rectangle(c, -30, -30, 60).fill(glowColor)
      })
    })
  }
}
