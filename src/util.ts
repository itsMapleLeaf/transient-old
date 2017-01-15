export function lerp(a: number, b: number, delta: number) {
  return a + (b - a) * delta
}

export function delta(num: number, a: number, b: number) {
  if (b - a === 0) return 0
  return (num - a) / (b - a)
}
