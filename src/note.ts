import * as pixi from 'pixi.js'

import {viewWidth} from './game'
import {trackMargin, noteSpacing} from './gameplay'
import {RectangleFillSprite, RectangleLineSprite} from './rect'
import * as util from './util'

export enum NoteState { active, hit, missed, holding }

export class NoteData {
  constructor(public time: number, public position: number) {}

  getScreenPosition() {
    const x = util.lerp(trackMargin, viewWidth - trackMargin, this.position)
    const y = util.lerp(0, -noteSpacing, this.time)
    return new pixi.Point(x, y)
  }
}

export class Note extends pixi.Container {
  state = NoteState.active

  data: NoteData

  constructor(time: number, position: number) {
    super()
    this.addChild(new RectangleFillSprite(0, 0, 40))
    this.addChild(new RectangleLineSprite(0, 0, 50))
    this.data = new NoteData(time, position)
    this.position = this.data.getScreenPosition()
    this.rotation = util.radians(45)
  }

  setState(state: NoteState) {
    if (state === NoteState.hit) {
      this.alpha = 0
    }
    this.state = state
  }
}

export class NoteHitAnimation extends pixi.Container {
  time = 0
  blur = new pixi.filters.BlurFilter()

  constructor(public startX: number, public startY: number) {
    super()
    this.addChild(new RectangleFillSprite(0, 0, 50))
    this.addChild(new RectangleFillSprite(0, 0, 50)).filters = [this.blur]
    this.position.set(startX, startY)
    this.rotation = util.radians(45)
  }

  update(dt: number) {
    this.time += dt / 0.4
    if (this.time >= 1) {
      this.destroy()
    } else {
      this.position.x = this.startX
      this.position.y = this.startY + this.time ** 2 * 100
      this.alpha = 1 - this.time ** 2
      this.blur.blur = (1 - this.time) * 20
    }
  }
}
