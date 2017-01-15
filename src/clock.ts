export class Clock {
  time = 0

  constructor(public period: number) {}

  update(dt: number): number {
    this.time += dt
    let iterations = 0
    while (this.time >= this.period) {
      this.time -= this.period
      iterations += 1
    }
    return iterations
  }
}
