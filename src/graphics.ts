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
    return `hsl(${h}, ${s}%, ${l}%)`
  }
}

export const canvas = document.querySelector('canvas') as HTMLCanvasElement
export const context2d = canvas.getContext('2d')

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

export function rectangle(x: number, y: number, width: number, height: number) {
  if (context2d) {
    context2d.fillStyle = 'white'
    context2d.fillRect(x, y, width, height)
  }
}
