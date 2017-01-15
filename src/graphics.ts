import {Point} from './point'
import {Color} from './color'
import * as util from './util'

export const canvas = document.querySelector('canvas') as HTMLCanvasElement

export function getWidth(): number {
  return canvas.width
}

export function getHeight(): number {
  return canvas.height
}

export function setBackgroundColor(color: Color) {
  canvas.style.backgroundColor = color.toString()
}

export function setDimensions(width: number, height: number) {
  canvas.width = width
  canvas.height = height
}

export function drawFrame(draw: (c: CanvasRenderingContext2D) => any) {
  const context = canvas.getContext('2d')
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    draw(context)
  }
}

export function rectangle(c: CanvasRenderingContext2D, x: number, y: number, width: number, height = width) {
  return new RectangleDrawingContext(c, x, y, width, height)
}

export function applyCenteredRotation(angle: number, center: Point, c: CanvasRenderingContext2D, draw: (...args: any[]) => any) {
  c.save()
  c.translate(center.x, center.y)
  c.rotate(util.radians(angle))
  draw()
  c.restore()
}

class RectangleDrawingContext {
  rotation = 0
  alignment = new Point(0.5, 0.5)

  constructor(
    private context: CanvasRenderingContext2D,
    private x: number,
    private y: number,
    private width: number,
    private height: number,
  ) {}

  rotate(degrees: number): this {
    this.rotation += degrees
    return this
  }

  align(x: number, y: number): this {
    this.alignment = new Point(x, y)
    return this
  }

  fill(color: Color): this {
    this.applyTransform(() => {
      this.context.fillStyle = color.toString()
      this.context.fillRect(
        Math.round(-this.width * this.alignment.x),
        Math.round(-this.height * this.alignment.y),
        Math.round(this.width),
        Math.round(this.height))
    })
    return this
  }

  stroke(color: Color, lineWidth: number): this {
    this.applyTransform(() => {
      this.context.strokeStyle = color.toString()
      this.context.lineWidth = lineWidth
      this.context.strokeRect(
        Math.round(-this.width * this.alignment.x),
        Math.round(-this.height * this.alignment.y),
        Math.round(this.width),
        Math.round(this.height))
    })
    return this
  }

  private applyTransform(drawfunc: (...args: any[]) => any) {
    const halfWidth = this.width * this.alignment.x
    const halfHeight = this.height * this.alignment.y
    this.context.save()
    this.context.translate(this.x, this.y)
    this.context.rotate(util.radians(this.rotation))
    drawfunc()
    this.context.restore()
  }
}
