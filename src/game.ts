import * as pixi from 'pixi.js'
import {createRectangle} from './rectangle'

export const viewWidth = 540
export const viewHeight = 960

class Note extends pixi.Container {
  constructor() {
    super()

    const inner = this.addChild(createRectangle(0xffffff, 0, 0, 40).fill())
    const outer = this.addChild(createRectangle(0xffffff, 0, 0, 50).stroke(1))

    this.rotation = Math.PI * 0.25
  }
}

export class Game {
  stage = new pixi.Container()

  constructor(public renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    const note = this.stage.addChild(new Note())
    note.position.set(100, 100)
  }

  update(dt: number) {
    this.renderer.render(this.stage)
  }
}
