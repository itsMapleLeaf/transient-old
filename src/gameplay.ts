import * as pixi from 'pixi.js'

import {GameState} from './game'
import {Playfield} from './playfield'
import {Note, NoteState, NoteHitAnimation, NoteReceptor} from './note'
import {TypedContainer} from './pixi-utils'
import {JudgementAnimation, getJudgement} from './judgement'
import {viewWidth, viewHeight, receptorPosition, noteSpacing} from './constants'

export class Gameplay extends GameState {
  stage = new pixi.Container()
  playfield = new Playfield()
  notes = new TypedContainer<Note>()
  animations = new TypedContainer<NoteHitAnimation | NoteReceptor>()
  judgement = new JudgementAnimation(viewWidth / 2, viewHeight * 0.25)
  songTime = -2

  constructor() {
    super()

    const notes = [
      new Note(0 / 2, 0 / 4),
      new Note(1 / 2, 1 / 4),
      new Note(2 / 2, 2 / 4),
      new Note(3 / 2, 3 / 4),
      new Note(4 / 2, 4 / 4),
    ]

    for (const note of notes) {
      this.notes.addChild(note)
      this.animations.addChild(new NoteReceptor(note.x, receptorPosition, note))
    }

    this.stage.addChild(this.playfield)
    this.stage.addChild(this.notes)
    this.stage.addChild(this.animations)
    this.stage.addChild(this.judgement)
  }

  update(dt: number) {
    this.songTime += dt
    for (const anim of this.animations.children) anim.update(dt)
    this.notes.y = this.songTime * noteSpacing + receptorPosition
    this.judgement.update(dt)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const note = this.findTappedNote(event.data.global)
    if (note) {
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
    return null
  }

  addNoteHitAnimation(note: Note) {
    const anim = new NoteHitAnimation(note.x, receptorPosition)
    this.animations.addChild(anim)
  }

  render(renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    renderer.render(this.stage)
  }
}
