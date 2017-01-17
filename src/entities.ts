import * as pixi from 'pixi.js'

import {createRect} from './shapes'
import {trackMargin, viewWidth, noteSpacing} from './game'
import * as util from './util'

export class Note {
  sprite = new pixi.Container()

  constructor(public time: number, public position: number) {
    // inner square
    this.sprite.addChild(createRect(0, 0, 40).fill(0xffffff))

    // outer square
    this.sprite.addChild(createRect(0, 0, 50).stroke(1, 0xffffff))

    this.sprite.position.x = util.lerp(trackMargin, viewWidth - trackMargin, position)
    this.sprite.position.y = util.lerp(0, noteSpacing, time) * -1
    this.sprite.rotation = Math.PI * 0.25
  }
}
