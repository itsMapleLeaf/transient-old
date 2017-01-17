import * as pixi from 'pixi.js'

import {createRect} from './shapes'
import {trackMargin, viewWidth, noteSpacing} from './game'
import * as util from './util'

export abstract class Entity {
  abstract sprite: pixi.Container
  update(dt: number) {}
  handleMessage(msg: string, ...params: any[]) {}
}

export class Note extends Entity {
  sprite = new pixi.Container()

  constructor(public time: number, public position: number) {
    super()

    // inner square
    this.sprite.addChild(createRect(0, 0, 40).fill())

    // outer square
    this.sprite.addChild(createRect(0, 0, 50).stroke(1))

    this.sprite.position.x = util.lerp(trackMargin, viewWidth - trackMargin, position)
    this.sprite.position.y = util.lerp(0, noteSpacing, time) * -1
    this.sprite.rotation = util.radians(45)
  }
}

export class NoteHitAnimation extends Entity {
  sprite = new pixi.Container()
  rect = createRect(0, 0, 50).fill()
  glow = createRect(0, 0, 50).fill()
  blurFilter = new pixi.filters.BlurFilter(20)
  time = 0

  constructor(x: number, private y: number) {
    super()

    this.glow.filters = [this.blurFilter]

    this.sprite.addChild(this.rect, this.glow)
    this.sprite.position.set(x, y)
    this.sprite.rotation = util.radians(45)
  }

  update(dt: number) {
    this.time += dt / 0.4
    if (this.time < 1) {
      this.sprite.position.y = this.y + (this.time ** 2) * 80
      this.sprite.alpha = 1 - (this.time ** 2)
      this.blurFilter.blur = Math.max((1 - this.time * 0.5) * 20, 0)
    } else {
      if (this.sprite.parent) this.sprite.parent.removeChild(this.sprite)
    }
  }
}
