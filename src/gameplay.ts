import * as pixi from 'pixi.js'

import {GameState, viewWidth, viewHeight} from './game'
import {RectangleFillSprite, RectangleLineSprite} from './sprites'
import * as util from './util'

export const noteSpacing = 300 // pixels per second
export const trackMargin = 100
export const receptorPosition = viewHeight * 0.88

enum NoteState { active, hit, missed, holding }

class Playfield extends pixi.Container {
  constructor() {
    super()

    const shade = new RectangleFillSprite(viewWidth / 2, viewHeight / 2, viewWidth - trackMargin, viewHeight, 0, 0.3)
    const receptor = new RectangleFillSprite(viewWidth / 2, receptorPosition, viewWidth - trackMargin, 2, undefined, 0.5)
    const left = new RectangleFillSprite(trackMargin / 2, viewHeight / 2, 2, viewHeight)
    const right = new RectangleFillSprite(viewWidth - trackMargin / 2, viewHeight / 2, 2, viewHeight)
    const glow = new RectangleFillSprite(viewWidth / 2, receptorPosition, viewWidth - trackMargin, 20)

    this.addChild(shade)
    this.addChild(receptor)
    this.addChild(left)
    this.addChild(right)
    this.addChild(glow)

    const blur = new pixi.filters.BlurFilter(50, 20)
    glow.filters = [blur]
    blur.blurX = 0
  }
}

class NoteData {
  constructor(public time: number, public position: number) {}

  getScreenPosition() {
    const x = util.lerp(trackMargin, viewWidth - trackMargin, this.position)
    const y = util.lerp(0, -noteSpacing, this.time)
    return new pixi.Point(x, y)
  }
}

class Note extends pixi.Container {
  state = NoteState.active

  data: NoteData

  constructor(time: number, position: number) {
    super()
    this.addChild(new RectangleFillSprite(0, 0, 40))
    this.addChild(new RectangleLineSprite(0, 0, 50))
    this.data = new NoteData(time, position)
    this.position = this.data.getScreenPosition()
    this.rotation = util.radians(45)
  }

  setState(state: NoteState) {
    if (state === NoteState.hit) {
      this.alpha = 0
    }
    this.state = state
  }
}

class NoteHitAnimation extends pixi.Container {
  time = 0
  blur = new pixi.filters.BlurFilter()

  constructor(public startX: number, public startY: number) {
    super()
    this.addChild(new RectangleFillSprite(0, 0, 50))
    this.addChild(new RectangleFillSprite(0, 0, 50)).filters = [this.blur]
    this.position.set(startX, startY)
    this.rotation = util.radians(45)
  }

  update(dt: number) {
    this.time += dt / 0.4
    if (this.time >= 1) {
      this.destroy()
    } else {
      this.position.x = this.startX
      this.position.y = this.startY + this.time ** 2 * 100
      this.alpha = 1 - this.time ** 2
      this.blur.blur = (1 - this.time) * 20
    }
  }
}

export class Gameplay extends GameState {
  stage = new pixi.Container()
  playfield = new Playfield()
  notes = new pixi.Container()
  animations = new pixi.Container()
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
  }

  update(dt: number) {
    this.songTime += dt
    for (const note of this.notes.children as Note[]) {
      note.y = note.data.getScreenPosition().y + receptorPosition + this.songTime * noteSpacing
    }
    for (const anim of this.animations.children as NoteHitAnimation[]) {
      anim.update(dt)
    }
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const note = this.findTappedNote(event.data.global)
    if (note instanceof Note) {
      note.setState(NoteState.hit)
      const anim = new NoteHitAnimation(note.data.getScreenPosition().x, receptorPosition)
      this.animations.addChild(anim)
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

  render(renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    renderer.render(this.stage)
  }
}
