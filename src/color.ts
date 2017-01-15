export type Color = [number, number, number, number]

export function rgb(r: number, g: number, b: number, a = 1): Color {
  return [r, g, b, a]
}

export function fade([r, g, b, a]: Color, alpha: number): Color {
  return [r, g, b, a * alpha]
}

export function toRGBAString([r, g, b, a = 1]: Color): string {
  r = Math.round(r * 255)
  g = Math.round(g * 255)
  b = Math.round(b * 255)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export const white = rgb(1, 1, 1)
export const black = rgb(0, 0, 0)
