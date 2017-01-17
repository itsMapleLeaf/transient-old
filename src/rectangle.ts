import * as pixi from 'pixi.js'

export function createRectangle(color: number, x: number, y: number, width: number, height = width) {
  const rect = new pixi.Graphics()

  rect.position.set(x, y)
  rect.pivot.set(width / 2, height / 2)

  return {
    fill() {
      rect.beginFill(color)
      rect.drawRect(0, 0, width, height)
      rect.endFill()
      return rect
    },
    stroke(lineWidth: number) {
      rect.lineStyle(lineWidth, color)
      rect.beginFill(0, 0)
      rect.drawRect(0, 0, width, height)
      rect.endFill()
      return rect
    }
  }
}
