import * as pixi from 'pixi.js'
import * as gameplay from './gameplay'
import * as util from './util'

export class ComboSprite extends pixi.Text {
  combo = 0
  time = 0

  constructor() {
    super('', {
      fontFamily: 'Teko',
      fontSize: 120,
      fill: 'white'
    })
    this.position.set(gameplay.viewWidth / 2, gameplay.viewHeight * 0.2)
  }

  update(dt: number) {
    this.time += dt
    if (this.combo > 0) {
      this.alpha = util.lerp(1, 0.5, util.clamp(util.delta(this.time, 0, 0.3), 0, 1))
    } else {
      this.alpha = 0
    }
    this.text = this.combo.toString()
    this.pivot.x = this.width / 2
  }

  add(combo: number) {
    this.combo += combo
    this.time = 0
  }

  reset() {
    this.combo = 0
  }
}
