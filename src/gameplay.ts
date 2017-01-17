import * as pixi from 'pixi.js'

import {GameState, viewHeight} from './game'
import {World, NoteContainer} from './entities'
import {SongTimeEvent, TapInputEvent} from './events'

export const noteSpacing = 300 // pixels per second
export const trackMargin = 80
export const receptorPosition = viewHeight * 0.82

export class Gameplay extends GameState {
  world = new World()
  songTime = -2

  constructor() {
    super()

    const notes = new NoteContainer()
    notes.addNote(0 / 2, 0 / 4)
    notes.addNote(1 / 2, 1 / 4)
    notes.addNote(2 / 2, 2 / 4)
    notes.addNote(3 / 2, 3 / 4)
    notes.addNote(4 / 2, 4 / 4)

    // this.stage.addChild(createRect(viewWidth / 2, receptorPosition, viewWidth, 10).fill(0xffffff, 0.5))

    this.world.add(notes)
  }

  update(dt: number) {
    this.songTime += dt
    this.world.update(dt)
    this.world.send(new SongTimeEvent(this.songTime))
  }

  render(renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    renderer.render(this.world.stage)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    this.world.send(new TapInputEvent(event.data.global, this.songTime))
  }
}
