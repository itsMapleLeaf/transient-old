import * as pixi from 'pixi.js'
import * as util from './util'

export const viewWidth = 540
export const viewHeight = 960
export const receptorPosition = viewHeight * 0.889
export const noteSpacing = 300

enum NoteState {
  active,
  hit,
  missed,
  holding,
}

function getTexture(name: string) {
  return pixi.loader.resources[name].texture
}

function renderBackground() {
  return new pixi.Sprite(getTexture('background'))
}

function renderReceptor(x: number, y: number, alpha: number) {
  const sprite = new pixi.Sprite(getTexture('receptor'))
  sprite.position.set(x, y)
  sprite.pivot.set(sprite.width / 2, sprite.height / 2)
  sprite.alpha = alpha
  return sprite
}

class Song {
  time = -2
}

class NoteData {
  constructor(public time: number, public position: number) {}
}

class Note {
  state = NoteState.active

  constructor(public data: NoteData) {}

  get screenPosition() {
    const x = util.lerp(110, viewWidth - 110, this.data.position)
    const y = -this.data.time * noteSpacing
    return new pixi.Point(x, y)
  }

  render() {
    const {x, y} = this.screenPosition
    const sprite = new pixi.Sprite(getTexture('note'))
    sprite.position.set(x, y)
    sprite.pivot.set(sprite.width / 2, sprite.height / 2)
    return sprite
  }
}

class NoteExplosion {
  time = 0

  constructor(public x: number, public y: number) {}

  update(dt: number) {
    this.time += dt * 3
    return this.time < 1
  }

  render() {
    const sprite = new pixi.Sprite(getTexture('explosion'))
    sprite.alpha = 1 - this.time
    sprite.x = this.x
    sprite.y = this.y + this.time ** 2.5 * 80
    sprite.pivot.set(sprite.width / 2, sprite.height / 2)
    return sprite
  }
}

export default class Game {
  song = new Song()
  notes = [] as Note[]
  explosions = [] as NoteExplosion[]

  stage = new pixi.Container()
  noteContainer = new pixi.Container()
  receptorContainer = new pixi.Container()
  explosionContainer = new pixi.Container()

  constructor() {
    this.notes = [
      new Note(new NoteData(0 / 2, 0 / 4)),
      new Note(new NoteData(1 / 2, 1 / 4)),
      new Note(new NoteData(2 / 2, 2 / 4)),
      new Note(new NoteData(3 / 2, 3 / 4)),
      new Note(new NoteData(4 / 2, 4 / 4)),
    ]

    this.stage.addChild(renderBackground())
    this.stage.addChild(this.receptorContainer)
    this.stage.addChild(this.explosionContainer)
    this.stage.addChild(this.noteContainer)
  }

  update(dt: number) {
    this.song.time += dt

    // update note positions
    this.noteContainer.y = receptorPosition + this.song.time * noteSpacing

    // update note explosion animations, only keep ones that are still active
    this.explosions = this.explosions.filter(anim => anim.update(dt))
  }

  draw(renderer: pixi.SystemRenderer) {
    this.renderNotes()
    this.renderReceptors()
    this.renderExplosions()
    renderer.render(this.stage)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const note = this.tryTapNote(event.data.global)
    if (note) {
      this.explosions.push(new NoteExplosion(note.screenPosition.x, receptorPosition))
    }
  }

  renderNotes() {
    this.noteContainer.removeChildren()

    this.notes
      .filter(note => note.state === NoteState.active)
      .forEach(note => this.noteContainer.addChild(note.render()))
  }

  renderReceptors() {
    this.receptorContainer.removeChildren()

    this.notes
      .filter(note => note.state === NoteState.active)
      .filter(note => this.song.time < note.data.time)
      .forEach(note => {
        const alpha = 1 - Math.abs(this.song.time - note.data.time) * 0.3
        this.receptorContainer.addChild(renderReceptor(note.screenPosition.x, receptorPosition, alpha))
      })
  }

  renderExplosions() {
    this.explosionContainer.removeChildren()
    this.explosions.forEach(exp => this.explosionContainer.addChild(exp.render()))
  }

  tryTapNote(touch: pixi.Point) {
    for (const note of this.notes as Note[]) {
      const isActive = note.state === NoteState.active
      const touchDistance = Math.abs(note.screenPosition.x - touch.x)
      const touchTiming = Math.abs(this.song.time - note.data.time)
      if (isActive && touchDistance < 80 && touchTiming < 0.25) {
        note.state = NoteState.hit
        return note
      }
    }
    return null
  }
}
