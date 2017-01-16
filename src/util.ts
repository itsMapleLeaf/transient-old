export function lerp(a: number, b: number, delta: number) {
  return a + (b - a) * delta
}

export function delta(num: number, a: number, b: number) {
  if (b - a === 0) return 0
  return (num - a) / (b - a)
}

export function clamp(num: number, min: number, max: number) {
  return (
    num > max ? max :
    num < min ? min :
    num
  )
}

export function radians(degrees: number) {
  return degrees / 180 * Math.PI
}

export function sign(num: number) {
  return num > 0 ? 1 : num < 0 ? -1 : 0
}
