import * as pixi from 'pixi.js'

import {createRect} from './shapes'
import {World, NoteContainer, NoteHitAnimation} from './entities'
import * as util from './util'

export const viewWidth = 540
export const viewHeight = 960
export const noteSpacing = 300 // pixels per second
export const trackMargin = 80
export const receptorPosition = viewHeight * 0.82

export class Game {
  world = new World()
  input = new pixi.interaction.InteractionManager(this.renderer)
  songTime = -2

  constructor(public renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    const notes = new NoteContainer()
    notes.addNote(0 / 2, 0 / 4)
    notes.addNote(1 / 2, 1 / 4)
    notes.addNote(2 / 2, 2 / 4)
    notes.addNote(3 / 2, 3 / 4)
    notes.addNote(4 / 2, 4 / 4)

    // this.stage.addChild(createRect(viewWidth / 2, receptorPosition, viewWidth, 10).fill(0xffffff, 0.5))

    this.world.add(notes)

    // events
    this.input.on('pointerdown', this.pointerdown, this)
  }

  update(dt: number) {
    this.songTime += dt
    this.world.update(dt)
    this.world.send('updateSongTime', this.songTime)
    this.renderer.render(this.world.stage)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    console.log(event)
    this.world.add(new NoteHitAnimation(event.data.global.x, receptorPosition))
  }
}
