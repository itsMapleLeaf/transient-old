import * as pixi from 'pixi.js'

import {GameState, viewWidth, viewHeight} from './game'
import {createRect} from './shapes'
import * as util from './util'

export const noteSpacing = 300 // pixels per second
export const trackMargin = 100
export const receptorPosition = viewHeight * 0.88

function createPlayfield() {
  const sprite = new pixi.Container()
  const blur = new pixi.filters.BlurFilter(50, 20)

  const shade = createRect(viewWidth / 2, viewHeight / 2, viewWidth - trackMargin, viewHeight).fill(0, 0.3)
  const receptor = createRect(viewWidth / 2, receptorPosition, viewWidth - trackMargin, 2).fill(0xffffff, 0.5)
  const left = createRect(trackMargin / 2, viewHeight / 2, 2, viewHeight).fill(0xffffff, 0.5)
  const right = createRect(viewWidth - trackMargin / 2, viewHeight / 2, 2, viewHeight).fill(0xffffff, 0.5)
  const glow = createRect(viewWidth / 2, receptorPosition, viewWidth - trackMargin, 50).fill(0xffffff, 0.2)

  sprite.addChild(shade)

  sprite.addChild(receptor)
  sprite.addChild(left)
  sprite.addChild(right)
  sprite.addChild(glow)

  glow.filters = [blur]

  blur.blurX = 0

  return sprite
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
    this.sprite.addChild(createRect(0, 0, 50).stroke(2))
    this.sprite.rotation = util.radians(45)
    this.sprite.position = this.getScreenPosition()
  }

  getScreenPosition() {
    const x = util.lerp(trackMargin, viewWidth - trackMargin, this.position)
    const y = util.lerp(0, noteSpacing, this.time) * -1
    return new pixi.Point(x, y)
  }

  render() {
    return this.sprite
  }
}

interface Animation {
  update(dt: number): boolean
  render<T extends pixi.DisplayObject>(): T
}

class NoteHitAnimation implements Animation {
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

  render() {
    return this.sprite
  }

  isActive() {
    return this.time < 1
  }
}

class AnimationLayer {
  animations = [] as Animation[]
  sprite = new pixi.Container()

  add(anim: Animation) {
    this.animations.push(anim)
  }

  update(dt: number) {
    this.animations = this.animations.filter(anim => anim.update(dt))
  }

  render() {
    this.sprite.removeChildren()
    this.animations.forEach(anim => this.sprite.addChild(anim.render()))
    return this.sprite
  }
}

class NoteLayer {
  sprite = new pixi.Container()
  notes = [] as Note[]

  add(note: Note) {
    this.notes.push(note)
  }

  render() {
    this.sprite.removeChildren()
    this.notes.forEach(note => this.sprite.addChild(note.render()))
    return this.sprite
  }

  updateNotePosition(songTime: number) {
    this.sprite.position.y = getNoteOffset(songTime)
  }

  findTappedNote(event: pixi.interaction.InteractionEvent, songTime: number) {
    const isActive = (note: Note) =>
      note.state === NoteState.active

    const checkTiming = (note: Note) =>
      Math.abs(note.time - songTime) < 0.2

    const checkTapPosition = (note: Note) =>
      Math.abs(event.data.global.x - note.getScreenPosition().x) < 80

    // TODO: fix later if this causes performance problems
    const note = this.notes
      .filter(isActive)
      .filter(checkTiming)
      .filter(checkTapPosition)[0]

    if (note) {
      return note
    }
  }
}

export class Gameplay extends GameState {
  stage = new pixi.Container()
  playfield = createPlayfield()
  noteLayer = new NoteLayer()
  animationLayer = new AnimationLayer()

  songTime = -2

  constructor() {
    super()

    this.noteLayer.add(new Note(0 / 2, 0 / 4))
    this.noteLayer.add(new Note(1 / 2, 1 / 4))
    this.noteLayer.add(new Note(2 / 2, 2 / 4))
    this.noteLayer.add(new Note(3 / 2, 3 / 4))
    this.noteLayer.add(new Note(4 / 2, 4 / 4))

    this.stage.addChild(this.playfield)
    this.stage.addChild(this.noteLayer.render())
    this.stage.addChild(this.animationLayer.render())
  }

  update(dt: number) {
    this.songTime += dt
    this.animationLayer.update(dt)
    this.noteLayer.updateNotePosition(this.songTime)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const note = this.noteLayer.findTappedNote(event, this.songTime)
    if (note) {
      note.state = NoteState.hit
      this.animationLayer.add(new NoteHitAnimation(note.getScreenPosition().x, receptorPosition))
    }
  }

  render(renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    this.noteLayer.render()
    this.animationLayer.render()
    renderer.render(this.stage)
  }
}
