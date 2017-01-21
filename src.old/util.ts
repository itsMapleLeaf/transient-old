type EasingFunction = (time: number) => number

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

export function tween(startValue: number, finishValue: number, startTime: number, finishTime: number, time: number, ease: EasingFunction = easeQuadOut) {
  return lerp(startValue, finishValue, ease(clamp(delta(time, startTime, finishTime), 0, 1)))
}

export function easeLinear(time: number) {
  return time
}

export function easeQuadIn(time: number) {
  return time ** 2
}

export function easeQuadOut(time: number) {
  return time ** (1 / 2)
}
