import * as pixi from 'pixi.js'
import * as resources from './resources'

export class NoteExplosionSprite extends pixi.Sprite {
  time = 0
  origin = new pixi.Point()

  constructor(public x: number, public y: number) {
    super(resources.getTexture('explosion'))
    this.pivot.set(this.width / 2, this.height / 2)
    this.origin.set(x, y)
  }

  update(dt: number) {
    this.time += dt * 3
    if (this.time < 1) {
      this.alpha = 1 - this.time
      this.position.x = this.origin.x
      this.position.y = this.origin.y + this.time ** 2.5 * 80
    } else {
      this.destroy()
    }
  }
}
