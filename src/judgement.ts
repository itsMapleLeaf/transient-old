import * as pixi from 'pixi.js'
import * as gameplay from './gameplay'
import * as util from './util'

const timingAbsolute = 0.02
const timingPerfect = 0.03
const timingGreat = 0.12
const timingBad = 0.25

const judgementText = {
  [Judgement.absolute]: 'ABSOLUTE',
  [Judgement.perfect]: 'PERFECT',
  [Judgement.great]: 'GREAT',
  [Judgement.bad]: 'BAD',
  [Judgement.miss]: 'BREAK',
}

const judgementColor = {
  [Judgement.absolute]: 'rgb(52, 152, 219)',
  [Judgement.perfect]: 'rgb(241, 196, 15)',
  [Judgement.great]: 'rgb(46, 204, 113)',
  [Judgement.bad]: 'rgb(155, 89, 182)',
  [Judgement.miss]: 'rgb(231, 76, 60)',
}

const enum Judgement {
  absolute,
  perfect,
  great,
  bad,
  miss,
  none,
}

function judgeTiming(timing: number) {
  timing = Math.abs(timing)
  return (
    timing <= timingAbsolute ? Judgement.absolute :
    timing <= timingPerfect ? Judgement.perfect :
    timing <= timingGreat ? Judgement.great :
    timing <= timingBad ? Judgement.bad :
    Judgement.none
  )
}

class JudgementSprite extends pixi.Text {
  judgement = Judgement.none
  time = 0

  constructor() {
    super('', {
      fontFamily: 'Teko',
      fontSize: 100,
    })

    this.position.set(gameplay.viewWidth / 2, gameplay.viewHeight * 0.35)
  }

  update(dt: number) {
    this.time += dt

    this.text = judgementText[this.judgement] || ''
    this.style.fill = judgementColor[this.judgement] || 'transparent'

    if (this.judgement < Judgement.bad) {
      this.alpha = 1 - util.delta(this.time, 0.8, 1)
      if (this.judgement === Judgement.absolute) {
        this.alpha *= util.lerp(0.3, 1, Math.sin(this.time * 100) / 2 + 0.5)
      }

      const bounce = 1 - util.clamp(util.delta(this.time, 0, 0.3), 0, 1) ** 0.3 * 25
      this.y = gameplay.viewHeight * 0.35 + bounce
    } else {
      this.alpha = util.lerp(1, 0, util.clamp(util.delta(this.time, 0.5, 1), 0, 1))
      this.y = gameplay.viewHeight * 0.35 + util.lerp(0, 40, util.clamp(util.delta(this.time, 0, 1), 0, 1))
    }

    this.pivot.x = this.width / 2
  }

  playJudgement(judgement: Judgement) {
    this.judgement = judgement
    this.time = 0
  }
}

export {
  Judgement,
  JudgementSprite,
  judgeTiming,
  timingAbsolute,
  timingPerfect,
  timingGreat,
  timingBad,
}
