import * as pixi from 'pixi.js'

import {GameState} from './game'
import {Judgement, JudgementSprite, getJudgement} from './judgement'
import {NoteSprite, NoteState, NoteHitSprite, NoteReceptorSprite} from './note'
import {PlayfieldSprite} from './playfield'
import {TypedContainer} from './pixi-utils'
import * as constants from './constants'

export class Gameplay extends GameState {
  stage = new pixi.Container()
  playfield = new PlayfieldSprite()
  notes = new TypedContainer<NoteSprite>()
  noteReceptors = new TypedContainer<NoteReceptorSprite>()
  noteHitAnimations = new TypedContainer<NoteHitSprite>()
  judgement = new JudgementSprite(constants.viewWidth / 2, constants.judgementPosition)
  songTime = -constants.songStartDelay

  constructor() {
    super()

    const notes = [
      new NoteSprite(0 / 2, 0 / 4),
      new NoteSprite(1 / 2, 1 / 4),
      new NoteSprite(2 / 2, 2 / 4),
      new NoteSprite(3 / 2, 3 / 4),
      new NoteSprite(4 / 2, 4 / 4),
    ]

    for (const note of notes) {
      this.notes.addChild(note)
      this.noteReceptors.addChild(new NoteReceptorSprite(note.x, constants.receptorPosition))
    }

    this.stage.addChild(
      this.playfield,
      this.noteReceptors,
      this.noteHitAnimations,
      this.notes,
      this.judgement)
  }

  update(dt: number) {
    this.songTime += dt

    // update note positions
    this.notes.y = this.songTime * constants.noteSpacing + constants.receptorPosition

    // update hit animations
    for (const anim of this.noteHitAnimations.children) {
      if (anim.update(dt)) {
        anim.destroy()
      }
    }

    // update note receptors
    for (let i = 0; i < this.notes.children.length; i++) {
      this.noteReceptors.children[i].update(this.notes.children[i])
    }

    // update judgement animation
    this.judgement.update(dt)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    for (const note of this.notes.children) {
      if (note.state === NoteState.active) {
        const judgement = getJudgement(note.data.time - this.songTime)
        const tapDistance = Math.abs(event.data.global.x - note.x)
        if (judgement !== Judgement.none && tapDistance < constants.noteTapAreaRadius) {
          note.setState(NoteState.hit)
          this.addNoteHitAnimation(note)
          this.judgement.play(judgement)
          break
        }
      }
    }
  }

  addNoteHitAnimation(note: NoteSprite) {
    const anim = new NoteHitSprite(note.x, constants.receptorPosition)
    this.noteHitAnimations.addChild(anim)
  }

  render(renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    renderer.render(this.stage)
  }
}
