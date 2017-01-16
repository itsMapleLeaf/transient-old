import {Color} from './color'
import {Howl} from 'howler'
import {Judgement, JudgementAnimation} from './judgement'
import {Note, NoteHitAnimation} from './note'
import {Point} from './point'
import * as graphics from './graphics'
import * as util from './util'

declare var require: Function

export const viewHeight = 1280
export const viewWidth = 720

export interface Drawable {
  draw(c: CanvasRenderingContext2D): void
}

export interface Animation extends Drawable {
  time: number
  update(dt: number): this
  isFinished(): boolean
}

export interface GameState {
  update(dt: number): GameState
  draw(c: CanvasRenderingContext2D): void
  pointerdown(touch: Point, event: PointerEvent): void
  pointerup(touch: Point, event: PointerEvent): void
  pointermove(touch: Point, event: PointerEvent): void
}

export class Game {
  constructor(public state: GameState) {
    graphics.setDimensions(viewWidth, viewHeight)
    graphics.setBackgroundColor(Color.black)
  }

  update(dt: number) {
    this.state = this.state.update(dt)
  }

  pointerdown(event: PointerEvent) {
    this.state.pointerdown(getNormalizedCoordinates(event), event)
  }

  pointerup(event: PointerEvent) {
    this.state.pointerup(getNormalizedCoordinates(event), event)
  }

  pointermove(event: PointerEvent) {
    this.state.pointermove(getNormalizedCoordinates(event), event)
  }

  draw() {
    graphics.drawFrame(c => this.state.draw(c))
  }
}

function getNormalizedCoordinates(event: PointerEvent): Point {
  const {width, height} = graphics.canvas.getBoundingClientRect()
  const px = event.offsetX / width * viewWidth
  const py = event.offsetY / height * viewHeight
  return new Point(px, py)
}
