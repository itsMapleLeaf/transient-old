import * as util from './util'

type EasingFunction = (delta: number) => number

export default class Tween {
  time = 0

  constructor(
    public startValue: number,
    public endValue: number,
    public duration: number,
    public ease: EasingFunction = Tween.linear,
  ) {}

  update(dt: number) {
    this.time += dt
    return this.value
  }

  get value() {
    const delta = util.clamp(this.time / this.duration, 0, 1)
    const value = this.startValue + (this.endValue - this.startValue) * this.ease(delta)
    return value
  }

  get done() {
    return this.time >= this.duration
  }

  static linear: EasingFunction = (delta: number) => delta
  static easeIn: EasingFunction = (delta: number) => delta ** 2
  static easeOut: EasingFunction = (delta: number) => delta ** 0.5
}
