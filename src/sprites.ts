import * as pixi from 'pixi.js'

import {viewWidth, viewHeight} from './game'
import {trackMargin, receptorPosition} from './gameplay'
import * as util from './util'

export function createRect(x: number, y: number, width: number, height = width) {
  const rect = new pixi.Graphics()

  rect.position.set(x, y)
  rect.pivot.set(width / 2, height / 2)

  return {
    fill(color: number = 0xffffff, alpha?: number) {
      rect.beginFill(color, alpha)
      rect.drawRect(0, 0, width, height)
      rect.endFill()
      return rect
    },
    stroke(lineWidth: number, color: number = 0xffffff, alpha?: number) {
      rect.lineStyle(lineWidth, color, alpha)
      rect.beginFill(0, 0)
      rect.drawRect(0, 0, width, height)
      rect.endFill()
      return rect
    }
  }
}

export function createPlayfield() {
  const sprite = new pixi.Container()
  const blur = new pixi.filters.BlurFilter(50, 20)

  const shade = createRect(viewWidth / 2, viewHeight / 2, viewWidth - trackMargin, viewHeight).fill(0, 0.3)
  const receptor = createRect(viewWidth / 2, receptorPosition, viewWidth - trackMargin, 2).fill(0xffffff, 0.5)
  const left = createRect(trackMargin / 2, viewHeight / 2, 2, viewHeight).fill(0xffffff, 0.5)
  const right = createRect(viewWidth - trackMargin / 2, viewHeight / 2, 2, viewHeight).fill(0xffffff, 0.5)
  const glow = createRect(viewWidth / 2, receptorPosition, viewWidth - trackMargin, 50).fill(0xffffff, 0.2)

  sprite.addChild(shade)

  sprite.addChild(receptor)
  sprite.addChild(left)
  sprite.addChild(right)
  sprite.addChild(glow)

  glow.filters = [blur]

  blur.blurX = 0

  return sprite
}

export function createNoteHit() {
  const sprite = new pixi.Container()
  const body = createRect(0, 0, 50).fill()

  sprite.addChild(body)
  sprite.rotation = util.radians(45)

  return sprite
}

export function createNote() {
  const sprite = new pixi.Container()
  sprite.addChild(createRect(0, 0, 40).fill())
  sprite.addChild(createRect(0, 0, 50).stroke(2))
  sprite.rotation = util.radians(45)
  return sprite
}
