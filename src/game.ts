import { Color } from './color'
import { Howl } from 'howler'
import { Judgement, JudgementAnimation } from './judgement'
import { Note, NoteHitAnimation } from './note'
import { Point } from './point'
import * as graphics from './graphics'
import * as util from './util'

export const viewHeight = 1280
export const viewWidth = 720

export class Game {
  constructor(public state: GameState) {
    graphics.setDimensions(viewWidth, viewHeight)
    graphics.setBackgroundColor(Color.black)
  }

  update(dt: number) {
    this.state = this.state.update(dt)
  }

  draw() {
    graphics.drawFrame(c => this.state.draw(c))
  }

  pointerdown(event: PointerEvent) { this.state.pointerdown(normalizeCoordinates(event), event) }
  pointerup(event: PointerEvent) { this.state.pointerup(normalizeCoordinates(event), event) }
  pointermove(event: PointerEvent) { this.state.pointermove(normalizeCoordinates(event), event) }
}

export abstract class GameState {
  update(dt: number): GameState { return this }
  draw(c: CanvasRenderingContext2D): void { }
  pointerdown(touch: Point, event: PointerEvent): void { }
  pointerup(touch: Point, event: PointerEvent): void { }
  pointermove(touch: Point, event: PointerEvent): void { }
}

function normalizeCoordinates(event: PointerEvent): Point {
  const {width, height} = graphics.canvas.getBoundingClientRect()
  const px = event.offsetX / width * viewWidth
  const py = event.offsetY / height * viewHeight
  return new Point(px, py)
}
