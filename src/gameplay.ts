import * as pixi from 'pixi.js'

import {GameState, viewWidth, viewHeight} from './game'
import {Playfield} from './playfield'
import {Note, NoteState, NoteHitAnimation} from './note'
import {TypedContainer} from './pixi-utils'
import * as util from './util'

export const noteSpacing = 300 // pixels per second
export const trackMargin = 100
export const receptorPosition = viewHeight * 0.88

const windowAbsolute = 0.02
const windowPerfect = 0.08
const windowGreat = 0.15
const windowBad = 0.28

enum Judgement {
  absolute,
  perfect,
  great,
  bad,
  none,
}

const judgementText = {
  [Judgement.absolute]: 'ABSOLUTE',
  [Judgement.perfect]: 'PERFECT',
  [Judgement.great]: 'GREAT',
  [Judgement.bad]: 'BAD',
}

class JudgementAnimation extends pixi.Container {
  text = this.addChild(new pixi.Text('ABSOLUTE', {
    fill: 0xffffff,
    fontSize: 80
  }))

  judgement = Judgement.none
  time = 0

  constructor(x: number, y: number) {
    super()
    this.position.set(x, y)
  }

  update(dt: number) {
    this.time += dt
    this.text.y = util.lerp(20, 0, util.clamp((this.time / 0.25) ** 0.5, 0, 1))
    this.text.text = judgementText[this.judgement] || ''
    this.text.pivot.x = this.text.width / 2
    this.alpha = util.lerp(1, 0, util.clamp(util.delta(this.time, 0.8, 1.0), 0, 1))
  }

  play(judgement: Judgement) {
    this.time = 0
    this.judgement = judgement
  }
}

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
      this.judgement.play(this.getJudgement(this.songTime - note.data.time))
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

  getJudgement(timing: number) {
    if (Math.abs(timing) < windowAbsolute) {
      return Judgement.absolute
    } else if (Math.abs(timing) < windowPerfect) {
      return Judgement.perfect
    } else if (Math.abs(timing) < windowGreat) {
      return Judgement.great
    } else if (Math.abs(timing) < windowBad) {
      return Judgement.bad
    }
    return Judgement.none
  }

  render(renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    renderer.render(this.stage)
  }
}
