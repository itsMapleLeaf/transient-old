export function lerp(a: number, b: number, delta: number) {
  return a + (b - a) * delta
}

export function delta(num: number, a: number, b: number) {
  return b - a === 0 ? 0 : (num - a) / (b - a)
}

export function radians(degrees: number) {
  return degrees / 180 * Math.PI
}

export function clamp(n: number, min: number, max: number) {
  return n > max ? max
    : n < min ? min
    : n
}

export function animationFrame(): Promise<number> {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve)
  })
}
