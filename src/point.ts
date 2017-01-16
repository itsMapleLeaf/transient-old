export class Point {
  constructor(public x: number, public y: number) {}

  add(other: Point) {
    return new Point(this.x + other.x, this.y + other.y)
  }

  subtract(other: Point) {
    return new Point(this.x - other.x, this.y - other.y)
  }
}
