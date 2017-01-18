import * as pixi from 'pixi.js'

export class RectangleFillSprite extends pixi.Graphics {
  constructor(x: number, y: number, width: number, height = width, color = 0xffffff, alpha = 1) {
    super()

    this.beginFill(color, alpha)
    this.drawRect(0, 0, width, height)
    this.endFill()

    this.position.set(x, y)
    this.pivot.set(width / 2, height / 2)
  }
}

export class RectangleLineSprite extends pixi.Graphics {
  constructor(x: number, y: number, width: number, height = width, lineWidth = 1, color = 0xffffff, alpha = 1) {
    super()

    this.lineStyle(lineWidth, color, alpha)
    this.beginFill(0, 0)
    this.drawRect(0, 0, width, height)
    this.endFill()

    this.position.set(x, y)
    this.pivot.set(width / 2, height / 2)
  }
}
