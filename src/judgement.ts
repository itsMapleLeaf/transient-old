import * as pixi from 'pixi.js'
import * as util from './util'

enum Judgement {
  absolute,
  perfect,
  great,
  bad,
  none,
}

const judgementText = {
  [Judgement.absolute]: 'ABSOLUTE',
  [Judgement.perfect]: 'PERFECT',
  [Judgement.great]: 'GREAT',
  [Judgement.bad]: 'BAD',
}

export const timingWindow = {
  [Judgement.absolute]: 0.02,
  [Judgement.perfect]: 0.08,
  [Judgement.great]: 0.15,
  [Judgement.bad]: 0.28,
}

export function getJudgement(timing: number) {
  for (let i = 0; i < Judgement.none; i++) {
    if (Math.abs(timing) < timingWindow[i]) {
      return i as Judgement
    }
  }
  return Judgement.none
}

export class JudgementAnimation extends pixi.Container {
  text = this.addChild(new pixi.Text('ABSOLUTE', {
    fill: 0xffffff,
    fontFamily: 'Teko',
    fontWeight: 'lighter',
    fontSize: 120
  }))

  judgement = Judgement.none
  time = 0

  constructor(x: number, y: number) {
    super()
    this.position.set(x, y)
  }

  update(dt: number) {
    this.time += dt
    this.text.y = util.tween(20, 0, 0, 0.2, this.time)
    this.text.text = judgementText[this.judgement] || ''
    this.text.pivot.x = this.text.width / 2
    this.alpha = util.tween(1, 0, 0.8, 1.0, this.time)
  }

  play(judgement: Judgement) {
    this.time = 0
    this.judgement = judgement
  }
}
