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
  return {
    fill(color: Color) {
      c.fillStyle = color.toString()
      c.fillRect(
        Math.round(x),
        Math.round(y),
        Math.round(width),
        Math.round(height))
    },
    stroke(color: Color, lineWidth: number) {
      c.strokeStyle = color.toString()
      c.lineWidth = lineWidth
      c.strokeRect(
        Math.round(x),
        Math.round(y),
        Math.round(width),
        Math.round(height))
    }
  }
}

export function applyCenteredRotation(angle: number, center: Point, c: CanvasRenderingContext2D, draw: (...args: any[]) => any) {
  c.save()
  c.translate(center.x, center.y)
  c.rotate(util.radians(angle))
  draw()
  c.restore()
}
