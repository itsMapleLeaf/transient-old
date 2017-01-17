import * as pixi from 'pixi.js'

export function createRect(x: number, y: number, width: number, height = width) {
  const rect = new pixi.Graphics()

  rect.position.set(x, y)
  rect.pivot.set(width / 2, height / 2)

  return {
    fill(color: number, alpha?: number) {
      rect.beginFill(color, alpha)
      rect.drawRect(0, 0, width, height)
      rect.endFill()
      return rect
    },
    stroke(lineWidth: number, color: number, alpha?: number) {
      rect.lineStyle(lineWidth, color, alpha)
      rect.beginFill(0, 0)
      rect.drawRect(0, 0, width, height)
      rect.endFill()
      return rect
    }
  }
}
