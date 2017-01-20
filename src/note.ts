import * as pixi from 'pixi.js'

import {viewWidth, trackMargin, noteSpacing} from './constants'
import {RectangleSprite} from './rect'
import {Glow} from './pixi-utils'
import * as util from './util'

const noteSize = 50

export const enum NoteState { active, hit, missed, holding }

export class NoteData {
  constructor(public time: number, public position: number) {}

  getScreenPosition() {
    const x = util.lerp(trackMargin, viewWidth - trackMargin, this.position)
    const y = util.lerp(0, -noteSpacing, this.time)
    return new pixi.Point(x, y)
  }
}

export class NoteSprite extends pixi.Container {
  state = NoteState.active

  constructor() {
    super()
    this.addChild(new RectangleSprite('fill', 0, 0, noteSize - 10))
    this.addChild(new RectangleSprite('line', 0, 0, noteSize))
    this.rotation = util.radians(45)
  }

  setState(state: NoteState) {
    if (state === NoteState.hit) {
      this.alpha = 0
    }
    this.state = state
  }
}

export class NoteHitSprite extends pixi.Container {
  body = this.addChild(new RectangleSprite('fill', 0, 0, noteSize))
  glow = this.addChild(new Glow(this.body, 20))
  time = 0

  origin: pixi.Point

  constructor(x: number, y: number) {
    super()
    this.origin = new pixi.Point(x, y)
    this.position = this.origin
    this.rotation = util.radians(45)
  }
}

export class NoteReceptorSprite extends pixi.Container {
  body = this.addChild(new RectangleSprite('line', 0, 0, noteSize, undefined, undefined, undefined, 2))

  constructor(x: number, y: number) {
    super()
    this.position.set(x, y)
    this.rotation = util.radians(45)
  }
}
