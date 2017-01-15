type Color = [number, number, number, number]

export const canvas = document.querySelector('canvas') as HTMLCanvasElement

export function rgb(r: number, g: number, b: number, a = 1): Color {
  return [r, g, b, a]
}

export function fade([r, g, b]: Color, alpha: number): Color {
  return [r, g, b, alpha]
}

export const colors = {
  black: rgb(0, 0, 0),
  white: rgb(1, 1, 1),
}

export function toRGBAString([r, g, b, a = 1]: Color): string {
  r = Math.round(r * 255)
  g = Math.round(g * 255)
  b = Math.round(b * 255)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export function getWidth(): number {
  return canvas.width
}

export function getHeight(): number {
  return canvas.height
}

export function setBackgroundColor(color: Color) {
  canvas.style.backgroundColor = toRGBAString(color)
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
