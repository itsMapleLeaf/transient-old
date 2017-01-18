import * as pixi from 'pixi.js'

import {GameState, viewWidth, viewHeight} from './game'
import {createRect} from './shapes'
import * as util from './util'

export const noteSpacing = 300 // pixels per second
export const trackMargin = 80
export const receptorPosition = viewHeight * 0.82

function createReceptor() {
  return createRect(viewWidth / 2, receptorPosition, viewWidth, 10).fill(0xffffff, 0.5)
}

function createNoteSprite(pos: pixi.Point) {
  const sprite = new pixi.Container()
  sprite.addChild(createRect(0, 0, 40).fill())
  sprite.addChild(createRect(0, 0, 50).stroke(1))
  sprite.position.copy(pos)
  sprite.rotation = util.radians(45)
  return sprite
}

function getNotePosition({ position, time }: Note) {
  const x = util.lerp(trackMargin, viewWidth - trackMargin, position)
  const y = util.lerp(0, noteSpacing, time) * -1
  return new pixi.Point(x, y)
}

function getNoteOffset(songTime: number) {
  return songTime * noteSpacing + receptorPosition
}

function refreshNoteSprites(container: pixi.Container, notes: Note[]) {
  const isActive = (note: Note) =>
    note.state === NoteState.active

  const addNote = (note: Note) => {
    const pos = getNotePosition(note)
    container.addChild(createNoteSprite(pos))
  }

  container.removeChildren()
  notes.filter(isActive).forEach(addNote)
}

enum NoteState { active, hit, missed, holding }

class Note {
  state = NoteState.active
  constructor(public time: number, public position: number) {}
}

class NoteHitAnimation {
  sprite = new pixi.Container()
  body = createRect(0, 0, 50).fill()
  glow = createRect(0, 0, 50).fill()
  blur = new pixi.filters.BlurFilter(20)
  time = 0

  constructor(public x: number, public y: number) {
    this.sprite.addChild(this.body)
    this.sprite.addChild(this.glow)
    this.sprite.rotation = util.radians(45)
    this.glow.filters = [this.blur]
  }

  update(dt: number) {
    this.time += dt / 0.4
    this.sprite.position.x = this.x
    this.sprite.position.y = this.y + this.time ** 2 * 100
    this.sprite.alpha = 1 - this.time ** 2
    this.blur.blur = (1 - this.time) * 20
    return this.isActive()
  }

  isActive() {
    return this.time < 1
  }
}

export class Gameplay extends GameState {
  songTime = -2
  notes = [
    new Note(0 / 2, 0 / 4),
    new Note(1 / 2, 1 / 4),
    new Note(2 / 2, 2 / 4),
    new Note(3 / 2, 3 / 4),
    new Note(4 / 2, 4 / 4),
  ]
  animations = [] as NoteHitAnimation[]

  stage = new pixi.Container()
  noteSprites = new pixi.Container()
  animationSprites = new pixi.Container()
  receptor = createReceptor()

  constructor() {
    super()
    this.stage.addChild(this.receptor)
    this.stage.addChild(this.noteSprites)
    this.stage.addChild(this.animationSprites)
    refreshNoteSprites(this.noteSprites, this.notes)
  }

  update(dt: number) {
    this.songTime += dt

    this.noteSprites.y = getNoteOffset(this.songTime)

    this.animations = this.animations.filter(anim => anim.update(dt))
    this.animationSprites.removeChildren()
    this.animations.forEach(anim => this.animationSprites.addChild(anim.sprite))
  }

  render(renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    renderer.render(this.stage)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const isActive = (note: Note) =>
      note.state === NoteState.active

    const checkTiming = (note: Note) =>
      Math.abs(note.time - this.songTime) < 0.2

    const checkTapPosition = (note: Note) =>
      Math.abs(event.data.global.x - getNotePosition(note).x) < 80

    const note = this.notes
      .filter(isActive)
      .filter(checkTiming)
      .filter(checkTapPosition)[0]

    if (note) {
      note.state = NoteState.hit
      refreshNoteSprites(this.noteSprites, this.notes)

      const anim = new NoteHitAnimation(getNotePosition(note).x, receptorPosition)
      this.animations.push(anim)
      this.animationSprites.addChild(anim.sprite)
    }
  }
}
