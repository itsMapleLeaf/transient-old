import * as pixi from 'pixi.js'

export default class RectangleSprite extends pixi.Graphics {
  constructor(mode: 'fill' | 'line', x: number, y: number, width: number, height = width, color = 0xffffff, alpha = 1, lineWidth = 1) {
    super()

    if (mode === 'fill') {
      this.beginFill(color, alpha)
    } else if (mode === 'line') {
      this.lineStyle(lineWidth, color, alpha)
      this.beginFill(0, 0)
    }

    this.drawRect(0, 0, width, height)
    this.endFill()

    this.position.set(x, y)
    this.pivot.set(width / 2, height / 2)
  }
}
