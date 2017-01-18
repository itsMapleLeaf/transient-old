import * as pixi from 'pixi.js'
import {viewWidth, viewHeight} from './game'
import {receptorPosition} from './gameplay'
import {RectangleFillSprite} from './rect'

export class Playfield extends pixi.Container {
  constructor() {
    super()

    const cx = viewWidth / 2
    const cy = viewHeight / 2
    const left = viewWidth * 0.05
    const right = viewWidth * 0.95
    const playfieldWidth = right - left

    const shade = new RectangleFillSprite(cx, cy, playfieldWidth, viewHeight, 0, 0.3)
    const receptor = new RectangleFillSprite(cx, receptorPosition, playfieldWidth, 2, undefined, 0.5)
    const leftBorder = new RectangleFillSprite(left, cy, 2, viewHeight)
    const rightBorder = new RectangleFillSprite(right, cy, 2, viewHeight)
    const glow = new RectangleFillSprite(cx, receptorPosition, playfieldWidth, 20)
    const bottomCover = new RectangleFillSprite(left, receptorPosition, playfieldWidth, viewHeight - receptorPosition, 0, 0.7)

    this.addChild(shade)
    this.addChild(receptor)
    this.addChild(glow)
    this.addChild(bottomCover)
    this.addChild(leftBorder)
    this.addChild(rightBorder)

    bottomCover.pivot.set(0, -2)

    const blur = new pixi.filters.BlurFilter(50, 20)
    glow.filters = [blur]
    blur.blurX = 0
  }
}
