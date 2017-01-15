import {Point} from './point'

export type Rectangle = { pos: Point, size: Point }

export function square(size: number): Rectangle {
  return {
    pos: { x: -size / 2, y: -size / 2 },
    size: { x: size, y: size },
  }
}
