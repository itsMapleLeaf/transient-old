export type Point = { x: number, y: number }

export function add({ x, y }: Point, dx: number, dy: number): Point {
  return { x: x + dx, y: y + dy }
}
