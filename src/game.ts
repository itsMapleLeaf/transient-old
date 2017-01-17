import * as pixi from 'pixi.js'
import {createRectangle} from './rectangle'

export const viewWidth = 540
export const viewHeight = 960

function createNote() {
  const note = new pixi.Container()
  note.addChild(createRectangle(0xffffff, 0, 0, 40).fill())
  note.addChild(createRectangle(0xffffff, 0, 0, 50).stroke(1))
  note.rotation = Math.PI * 0.25
  return note
}

export class Game {
  stage = new pixi.Container()

  constructor(public renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    const note = this.stage.addChild(createNote())
    note.position.set(100, 100)
  }

  update(dt: number) {
    this.renderer.render(this.stage)
  }
}
