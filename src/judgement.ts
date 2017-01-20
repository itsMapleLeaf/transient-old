import * as pixi from 'pixi.js'
import * as util from './util'

export const enum Judgement {
  absolute,
  perfect,
  great,
  bad,
  none,
}

export const timingWindow = {
  [Judgement.absolute]: 0.02,
  [Judgement.perfect]: 0.08,
  [Judgement.great]: 0.15,
  [Judgement.bad]: 0.28,
}

const judgementText = {
  [Judgement.absolute]: 'ABSOLUTE',
  [Judgement.perfect]: 'PERFECT',
  [Judgement.great]: 'GREAT',
  [Judgement.bad]: 'BAD',
}

const judgementColors = {
  [Judgement.absolute]: 0x3498db,
  [Judgement.perfect]: 0xf1c40f,
  [Judgement.great]: 0x2ecc71,
  [Judgement.bad]: 0xe74c3c,
}

export function getJudgement(timing: number) {
  for (let i = 0; i < Judgement.none; i++) {
    if (timingWindow[i] != null && Math.abs(timing) < timingWindow[i]) {
      return i as Judgement
    }
  }
  return Judgement.none
}

export class JudgementSprite extends pixi.Container {
  text = this.addChild(new pixi.Text('ABSOLUTE', {
    fill: 0xffffff,
    fontFamily: 'Teko',
    fontWeight: 'lighter',
    fontSize: 108
  }))

  judgement = Judgement.none
  time = 0

  constructor(x: number, y: number) {
    super()
    this.position.set(x, y)
  }

  update(dt: number) {
    this.time += dt

    if (this.judgement === Judgement.absolute) {
      this.text.alpha = util.lerp(1, 0.6, Math.sin(this.time * 100))
    }

    this.text.style.fill = judgementColors[this.judgement]
    this.text.y = util.tween(20, 0, 0, 0.2, this.time)
    this.text.text = judgementText[this.judgement] || ''
    this.text.pivot.x = this.text.width / 2
    this.alpha = util.tween(1, 0, 1.5, 1.8, this.time)
  }

  play(judgement: Judgement) {
    this.time = 0
    this.judgement = judgement
  }
}

export class ComboSprite extends pixi.Container {
  // TODO
}
