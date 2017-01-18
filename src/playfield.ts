import * as pixi from 'pixi.js'
import {viewWidth, viewHeight} from './game'
import {trackMargin, receptorPosition} from './gameplay'
import {RectangleFillSprite} from './rect'

export class Playfield extends pixi.Container {
  constructor() {
    super()

    const shade = new RectangleFillSprite(viewWidth / 2, viewHeight / 2, viewWidth - trackMargin, viewHeight, 0, 0.3)
    const receptor = new RectangleFillSprite(viewWidth / 2, receptorPosition, viewWidth - trackMargin, 2, undefined, 0.5)
    const left = new RectangleFillSprite(trackMargin / 2, viewHeight / 2, 2, viewHeight)
    const right = new RectangleFillSprite(viewWidth - trackMargin / 2, viewHeight / 2, 2, viewHeight)
    const glow = new RectangleFillSprite(viewWidth / 2, receptorPosition, viewWidth - trackMargin, 20)

    this.addChild(shade)
    this.addChild(receptor)
    this.addChild(left)
    this.addChild(right)
    this.addChild(glow)

    const blur = new pixi.filters.BlurFilter(50, 20)
    glow.filters = [blur]
    blur.blurX = 0
  }
}
