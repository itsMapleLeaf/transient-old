import * as pixi from 'pixi.js'

import {createRect} from './shapes'
import * as entities from './entities'
import * as util from './util'

export const viewWidth = 540
export const viewHeight = 960
export const noteSpacing = 300 // pixels per second
export const trackMargin = 80
export const receptorPosition = viewHeight * 0.82

export class Game {
  stage = new pixi.Container()
  input = new pixi.interaction.InteractionManager(this.renderer)
  entities = [] as entities.Entity[]
  songTime = -2

  constructor(public renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    // test notes
    const notes = new entities.NoteContainer()
    notes.addNote(0 / 2, 0 / 4)
    notes.addNote(1 / 2, 1 / 4)
    notes.addNote(2 / 2, 2 / 4)
    notes.addNote(3 / 2, 3 / 4)
    notes.addNote(4 / 2, 4 / 4)

    // receptor
    this.stage.addChild(createRect(viewWidth / 2, receptorPosition, viewWidth, 10).fill(0xffffff, 0.5))

    // note container
    this.addEntity(notes)

    // events
    this.input.on('pointerdown', this.pointerdown, this)
  }

  addEntity(ent: entities.Entity) {
    this.entities.push(ent)
    this.stage.addChild(ent.sprite)
  }

  update(dt: number) {
    this.songTime += dt
    this.entities = this.entities.filter(ent => this.stage.children.indexOf(ent.sprite) != null)
    this.entities.forEach(ent => ent.update(dt))
    this.entities.forEach(ent => ent.handleMessage('updateSongTime', this.songTime))
    this.renderer.render(this.stage)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    console.log(event)
    this.addEntity(new entities.NoteHitAnimation(event.data.global.x, receptorPosition))
  }
}
