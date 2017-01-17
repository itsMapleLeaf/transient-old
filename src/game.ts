import * as pixi from 'pixi.js'

import {createRect} from './shapes'
import {Note} from './entities'
import * as util from './util'

export const viewWidth = 540
export const viewHeight = 960
export const noteSpacing = 300 // pixels per second
export const trackMargin = 80
export const receptorPosition = viewHeight * 0.82

export class Game {
  stage = new pixi.Container()
  noteContainer = new pixi.Container()
  input = new pixi.interaction.InteractionManager(this.renderer)
  notes = [] as Note[]
  songTime = -2

  constructor(public renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    // test notes
    this.addNote(0 / 2, 0 / 4)
    this.addNote(1 / 2, 1 / 4)
    this.addNote(2 / 2, 2 / 4)
    this.addNote(3 / 2, 3 / 4)
    this.addNote(4 / 2, 4 / 4)

    // receptor
    this.stage.addChild(createRect(viewWidth / 2, receptorPosition, viewWidth, 10).fill(0xffffff, 0.5))

    // note container
    this.stage.addChild(this.noteContainer)

    // events
    this.input.on('pointerdown', this.pointerdown, this)
  }

  addNote(time: number, position: number) {
    const note = new Note(time, position)
    this.notes.push(note)
    this.noteContainer.addChild(note.sprite)
  }

  update(dt: number) {
    this.songTime += dt
    this.noteContainer.position.y = util.lerp(0, noteSpacing, this.songTime) + receptorPosition
    this.renderer.render(this.stage)
  }

  pointerdown(event: PointerEvent) {
    console.log(event)
  }
}
