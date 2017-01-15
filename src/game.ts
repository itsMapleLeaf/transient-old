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
  pointerdown(event: PointerEvent): void
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
    this.state.pointerdown(event)
  }

  draw() {
    graphics.drawFrame(c => this.state.draw(c))
  }
}
