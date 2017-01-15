export const canvas = document.querySelector('canvas') as HTMLCanvasElement
export const context2d = canvas.getContext('2d')

interface Color {
  toString(): string
}

export class ColorHSL implements Color {
  constructor(
    public h: number,
    public s: number,
    public l: number,
    public a = 1,
  ) {}

  toString() {
    const h = Math.round(this.h * 255)
    const s = Math.round(this.s * 100)
    const l = Math.round(this.l * 100)
    return `hsla(${h}, ${s}%, ${l}%, ${this.a})`
  }
}

abstract class Drawable {
  protected color: Color = new ColorHSL(1, 1, 1)

  constructor(protected x: number, protected y: number) {}

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }

  setColor(color: Color) {
    this.color = color
    return this
  }
}

export class Rectangle extends Drawable {
  private halign = 0.5
  private valign = 0.5
  private angle = 0

  constructor(x: number, y: number, private width: number, private height = width) {
    super(x, y)
  }

  setSize(w: number, h = w) {
    this.width = w
    this.height = h
    return this
  }

  setAlign(halign: number, valign: number) {
    this.halign = halign
    this.valign = valign
    return this
  }

  setAngle(angle: number) {
    this.angle = angle
    return this
  }

  fill() {
    if (!context2d) throw "Could not get canvas context"

    this.applyTransform(() => {
      context2d.fillStyle = this.color.toString()
      context2d.fillRect(0, 0, this.width, this.height)
    })

    return this
  }

  stroke(lineWidth: number) {
    if (!context2d) throw "Could not get canvas context"

    this.applyTransform(() => {
      context2d.strokeStyle = this.color.toString()
      context2d.lineWidth = lineWidth
      context2d.strokeRect(0, 0, this.width, this.height)
    })

    return this
  }

  private getAlignedPosition(): [number, number] {
    const x = this.x - this.width * this.halign
    const y = this.y - this.height * this.valign
    return [x, y]
  }

  private applyTransform(drawOperation) {
    if (context2d) {
      const [x, y] = this.getAlignedPosition()
      context2d.save()
      context2d.translate(x, y)
      context2d.translate(this.width * this.halign, this.height * this.valign)
      context2d.rotate(this.angle / 180 * Math.PI)
      context2d.translate(-this.width * this.halign, -this.height * this.valign)
      drawOperation()
      context2d.restore()
    }
  }
}

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

export function clear() {
  if (context2d) {
    context2d.clearRect(0, 0, canvas.width, canvas.height)
  }
}
