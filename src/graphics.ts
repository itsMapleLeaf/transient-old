import {Point} from './point'
import {Rectangle} from './rect'
import * as color from './color'
import * as util from './util'

export const canvas = document.querySelector('canvas') as HTMLCanvasElement

export function getWidth(): number {
  return canvas.width
}

export function getHeight(): number {
  return canvas.height
}

export function setBackgroundColor(c: color.Color) {
  canvas.style.backgroundColor = color.toRGBAString(c)
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

export function fillRect(c: CanvasRenderingContext2D, { pos, size }: Rectangle) {
  c.fillRect(Math.round(pos.x), Math.round(pos.y), Math.round(size.x), Math.round(size.y))
}

export function strokeRect(c: CanvasRenderingContext2D, { pos, size }: Rectangle) {
  c.strokeRect(Math.round(pos.x), Math.round(pos.y), Math.round(size.x), Math.round(size.y))
}

export function applyCenteredRotation(angle: number, center: Point, c: CanvasRenderingContext2D, draw: (...args: any[]) => any) {
  c.save()
  c.translate(center.x, center.y)
  c.rotate(util.radians(angle))
  draw()
  c.restore()
}
