import * as pixi from 'pixi.js'

import {GameState, viewWidth, viewHeight} from './game'
import {Playfield} from './playfield'
import {Note, NoteState, NoteHitAnimation} from './note'
import {TypedContainer} from './pixi-utils'
import {JudgementAnimation, getJudgement} from './judgement'

export const noteSpacing = 300 // pixels per second
export const trackMargin = 100
export const receptorPosition = viewHeight * 0.88

export class Gameplay extends GameState {
  stage = new pixi.Container()
  playfield = new Playfield()
  notes = new TypedContainer<Note>()
  animations = new TypedContainer<NoteHitAnimation>()
  judgement = new JudgementAnimation(viewWidth / 2, viewHeight * 0.25)
  songTime = -2

  constructor() {
    super()

    this.notes.addChild(new Note(0 / 2, 0 / 4))
    this.notes.addChild(new Note(1 / 2, 1 / 4))
    this.notes.addChild(new Note(2 / 2, 2 / 4))
    this.notes.addChild(new Note(3 / 2, 3 / 4))
    this.notes.addChild(new Note(4 / 2, 4 / 4))

    this.stage.addChild(this.playfield)
    this.stage.addChild(this.notes)
    this.stage.addChild(this.animations)
    this.stage.addChild(this.judgement)
  }

  update(dt: number) {
    this.songTime += dt
    for (const note of this.notes.children) {
      note.y = note.data.getScreenPosition().y + receptorPosition + this.songTime * noteSpacing
    }
    for (const anim of this.animations.children) {
      anim.update(dt)
    }
    this.judgement.update(dt)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const note = this.findTappedNote(event.data.global)
    if (note instanceof Note) {
      note.setState(NoteState.hit)
      this.addNoteHitAnimation(note)
      this.judgement.play(getJudgement(this.songTime - note.data.time))
    }
  }

  findTappedNote(tap: pixi.Point) {
    const isActive = (note: Note) =>
      note.state === NoteState.active

    const checkTiming = (note: Note) =>
      Math.abs(note.data.time - this.songTime) < 0.2

    const checkTapPosition = (note: Note) =>
      Math.abs(tap.x - note.x) < 80

    // TODO: fix later if this causes performance problems
    const note = this.notes.children
      .filter(isActive)
      .filter(checkTiming)
      .filter(checkTapPosition)[0]

    if (note) {
      return note
    }
  }

  addNoteHitAnimation(note: Note) {
    const pos = note.data.getScreenPosition()
    const anim = new NoteHitAnimation(pos.x, receptorPosition)
    this.animations.addChild(anim)
  }

  render(renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    renderer.render(this.stage)
  }
}
