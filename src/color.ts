export class Color {
  constructor(public r: number, public g: number, public b: number, public a = 1) {}

  toString(): string {
    const r = Math.round(this.r * 255)
    const g = Math.round(this.g * 255)
    const b = Math.round(this.b * 255)
    return `rgba(${r}, ${g}, ${b}, ${this.a})`
  }

  fade(opacity: number) {
    return new Color(this.r, this.g, this.b, this.a * opacity)
  }

  static white = new Color(1, 1, 1)
  static black = new Color(0, 0, 0)
}
