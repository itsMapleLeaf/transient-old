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

function getNoteOffset(songTime: number) {
  return songTime * noteSpacing + receptorPosition
}

enum NoteState { active, hit, missed, holding }

class Note {
  state = NoteState.active
  sprite = new pixi.Container()

  constructor(public time: number, public position: number) {
    this.sprite.addChild(createRect(0, 0, 40).fill())
    this.sprite.addChild(createRect(0, 0, 50).stroke(1))
    this.sprite.rotation = util.radians(45)
    this.sprite.position = this.getScreenPosition()
  }

  getScreenPosition() {
    const x = util.lerp(trackMargin, viewWidth - trackMargin, this.position)
    const y = util.lerp(0, noteSpacing, this.time) * -1
    return new pixi.Point(x, y)
  }
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
  animations = [] as NoteHitAnimation[]

  notes = [
    new Note(0 / 2, 0 / 4),
    new Note(1 / 2, 1 / 4),
    new Note(2 / 2, 2 / 4),
    new Note(3 / 2, 3 / 4),
    new Note(4 / 2, 4 / 4),
  ]

  stage = new pixi.Container()
  noteLayer = this.stage.addChild(new pixi.Container())
  animationLayer = this.stage.addChild(new pixi.Container())
  receptor = this.stage.addChild(createReceptor())

  update(dt: number) {
    this.songTime += dt
    this.animations = this.animations.filter(anim => anim.update(dt))
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const isActive = (note: Note) =>
      note.state === NoteState.active

    const checkTiming = (note: Note) =>
      Math.abs(note.time - this.songTime) < 0.2

    const checkTapPosition = (note: Note) =>
      Math.abs(event.data.global.x - note.getScreenPosition().x) < 80

    // TODO: fix later if this causes performance problems
    const note = this.notes
      .filter(isActive)
      .filter(checkTiming)
      .filter(checkTapPosition)[0]

    if (note) {
      note.state = NoteState.hit
      this.animations.push(new NoteHitAnimation(note.getScreenPosition().x, receptorPosition))
    }
  }

  render(renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    this.noteLayer.removeChildren()
    this.notes.forEach(note => note.state === NoteState.active && this.noteLayer.addChild(note.sprite))
    this.noteLayer.position.y = getNoteOffset(this.songTime)

    this.animationLayer.removeChildren()
    this.animations.forEach(anim => this.animationLayer.addChild(anim.sprite))

    renderer.render(this.stage)
  }
}
