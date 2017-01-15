import {Animation, viewWidth, viewHeight} from './game'
import {Color} from './color'
import * as graphics from './graphics'
import * as util from './util'

export enum Judgement {
  absolute,
  perfect,
  great,
  bad,
  none,
}

export class JudgementAnimation implements Animation {
  time = 0

  constructor(public judgement: Judgement) {}

  update(dt: number) {
    this.time += dt
    return this
  }

  isFinished() {
    return this.time >= 1.3
  }

  draw(c: CanvasRenderingContext2D) {
    const text =
      this.judgement === Judgement.absolute ? 'ABSOLUTE' :
      this.judgement === Judgement.perfect ? 'PERFECT' :
      this.judgement === Judgement.great ? 'GREAT' :
      this.judgement === Judgement.bad ? 'BAD' :
      ''

    const offset = (1 - util.clamp(this.time * 4, 0, 1) ** 0.5) * 32
    const opacity = 1 - util.delta(this.time, 1, 1.3)
    const judgeColor = Color.white.fade(util.clamp(opacity, 0, 1))

    graphics.applyShadow(c, judgeColor.fade(0.3), 20, 0, 0, () => {
      c.font = '80px Roboto Condensed'
      c.textAlign = 'center'
      c.fillStyle = judgeColor.toString()
      c.fillText(text, viewWidth / 2, viewHeight * 0.3 + offset)
    })
  }
}
