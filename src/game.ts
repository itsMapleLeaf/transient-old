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

class Song {
  time = -2
}

class Note {
  state = NoteState.active

  constructor(public time: number, public position: number) {}

  get screenPosition() {
    const x = util.lerp(110, viewWidth - 110, this.position)
    const y = -this.time * noteSpacing
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

class Receptor {
  constructor(public note: Note, public songTime: number) {}

  render() {
    const sprite = new pixi.Sprite(getTexture('receptor'))
    sprite.position.set(this.note.screenPosition.x, receptorPosition)
    sprite.pivot.set(sprite.width / 2, sprite.height / 2)
    sprite.alpha = 1 - Math.abs(this.songTime - this.note.time)
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
      new Note(0 / 2, 0 / 4),
      new Note(1 / 2, 1 / 4),
      new Note(2 / 2, 2 / 4),
      new Note(3 / 2, 3 / 4),
      new Note(4 / 2, 4 / 4),
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

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const note = this.tryTapNote(event.data.global)
    if (note) {
      this.explosions.push(new NoteExplosion(note.screenPosition.x, receptorPosition))
    }
  }

  draw(renderer: pixi.SystemRenderer) {
    this.renderNotes()
    this.renderReceptors()
    this.renderExplosions()
    renderer.render(this.stage)
  }

  renderNotes() {
    this.noteContainer.removeChildren()
    this.notes
      .filter(note => note.state === NoteState.active)
      .map(note => note.render())
      .forEach(sprite => this.noteContainer.addChild(sprite))
  }

  renderReceptors() {
    this.receptorContainer.removeChildren()
    this.notes
      .filter(note => note.state === NoteState.active)
      .filter(note => this.song.time < note.time)
      .map(note => new Receptor(note, this.song.time).render())
      .forEach(sprite => this.receptorContainer.addChild(sprite))
  }

  renderExplosions() {
    this.explosionContainer.removeChildren()
    this.explosions
      .map(exp => exp.render())
      .forEach(sprite => this.explosionContainer.addChild(sprite))
  }

  tryTapNote(touch: pixi.Point) {
    for (const note of this.notes as Note[]) {
      const isActive = note.state === NoteState.active
      const touchDistance = Math.abs(note.screenPosition.x - touch.x)
      const touchTiming = Math.abs(this.song.time - note.time)
      if (isActive && touchDistance < 80 && touchTiming < 0.25) {
        note.state = NoteState.hit
        return note
      }
    }
    return null
  }
}
