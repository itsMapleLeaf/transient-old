import * as pixi from 'pixi.js'
import * as resources from './resources'

export class ReceptorSprite extends pixi.Sprite {
  constructor(x: number, y: number, public time: number) {
    super(resources.getTexture('receptor'))
    this.position.set(x, y)
    this.pivot.set(this.width / 2, this.height / 2)
  }

  update(songTime: number) {
    if (songTime < this.time) {
      this.alpha = 1 - Math.abs(songTime - this.time)
    } else {
      this.alpha = 0
    }
  }
}
