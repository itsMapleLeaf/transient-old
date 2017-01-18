import * as pixi from 'pixi.js'
import {viewWidth, viewHeight, receptorPosition} from './constants'
import {RectangleFillSprite} from './rect'
import {Glow} from './pixi-utils'

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
    const bottomShade = new RectangleFillSprite(left, receptorPosition, playfieldWidth, viewHeight - receptorPosition, 0, 0.7)
    const glow = new Glow(new RectangleFillSprite(cx, receptorPosition, playfieldWidth, 40, undefined, 0.8), 50)

    this.addChild(shade)
    this.addChild(receptor)
    this.addChild(glow)
    this.addChild(bottomShade)
    this.addChild(leftBorder)
    this.addChild(rightBorder)

    glow.blurFilter.blurX = 0

    bottomShade.pivot.set(0, -2)
  }
}
