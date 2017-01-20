import * as pixi from 'pixi.js'

export const enum Judgement {
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

const judgementColors = {
  [Judgement.absolute]: '#3498db',
  [Judgement.perfect]: '#f1c40f',
  [Judgement.great]: '#2ecc71',
  [Judgement.bad]: '#e74c3c',
}

export default class JudgementSprite extends pixi.Container {
  text = this.addChild(new pixi.Text())

  constructor(judgement: Judgement) {
    super()
    this.text.text = judgementText[judgement] || ''
    this.text.style.fill = judgementColors[judgement] || 0
  }
}
