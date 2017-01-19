import * as pixi from 'pixi.js'
import {viewWidth, viewHeight, receptorPosition} from './constants'
import {RectangleSprite} from './rect'
import {Glow} from './pixi-utils'

export class Playfield extends pixi.Container {
  constructor() {
    super()

    const cx = viewWidth / 2
    const cy = viewHeight / 2
    const left = viewWidth * 0.05
    const right = viewWidth * 0.95
    const playfieldWidth = right - left

    const shade = new RectangleSprite('fill', cx, cy, playfieldWidth, viewHeight, 0, 0.5)
    const receptor = new RectangleSprite('fill', cx, receptorPosition, playfieldWidth, 2, undefined, 0.5)
    const leftBorder = new RectangleSprite('fill', left, cy, 2, viewHeight)
    const rightBorder = new RectangleSprite('fill', right, cy, 2, viewHeight)
    const bottomShade = new RectangleSprite('fill', left, receptorPosition, playfieldWidth, viewHeight - receptorPosition, 0, 0.75)
    const glow = new Glow(new RectangleSprite('fill', cx, receptorPosition, playfieldWidth, 40, undefined, 0.8), 60)

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
