import * as pixi from 'pixi.js'
import * as util from './util'

export const viewWidth = 540
export const viewHeight = 960
export const receptorPosition = viewHeight * 0.889
export const noteSpacing = 300

function getTexture(name: string) {
  return pixi.loader.resources[name].texture
}

enum NoteState {
  active,
  hit,
  missed,
  holding,
}

class Note {
  state = NoteState.active

  constructor(public time: number, public position: number) {}

  get screenPosition() {
    const x = util.lerp(110, viewWidth - 110, this.position)
    const y = receptorPosition + this.time * -noteSpacing
    return new pixi.Point(x, y)
  }
}

class Song {
  time = -2
  notes = [
    new Note(0 / 2, 0 / 4),
    new Note(1 / 2, 1 / 4),
    new Note(2 / 2, 2 / 4),
    new Note(3 / 2, 3 / 4),
    new Note(4 / 2, 4 / 4),
  ]
}

class NoteSprite extends pixi.Sprite {
  constructor(public note: Note) {
    super(getTexture('note'))
    this.position = note.screenPosition
    this.pivot.set(this.width / 2, this.height / 2)
  }
}

class NoteExplosionSprite extends pixi.Sprite {
  time = 0
  origin = new pixi.Point()

  constructor(public x: number, public y: number) {
    super(getTexture('explosion'))
    this.pivot.set(this.width / 2, this.height / 2)
    this.origin.set(x, y)
  }

  update(dt: number) {
    this.time += dt * 3
    if (this.time < 1) {
      this.alpha = 1 - this.time
      this.position.x = this.origin.x
      this.position.y = this.origin.y + this.time ** 2.5 * 80
    } else {
      this.destroy()
    }
  }
}

class ReceptorSprite extends pixi.Sprite {
  constructor(public note: Note, public song: Song) {
    super(getTexture('receptor'))
    this.position.set(note.screenPosition.x, receptorPosition)
    this.pivot.set(this.width / 2, this.height / 2)
  }

  update() {
    if (this.song.time < this.note.time && this.note.state === NoteState.active) {
      this.alpha = 1 - Math.abs(this.song.time - this.note.time)
    } else {
      this.alpha = 0
    }
  }
}

export default class Game {
  song = new Song()

  stage = new pixi.Container()
  receptors = new pixi.Container()
  explosions = new pixi.Container()
  notes = new pixi.Container()

  constructor() {
    this.stage.addChild(new pixi.Sprite(getTexture('background')))
    this.stage.addChild(this.receptors)
    this.stage.addChild(this.explosions)
    this.stage.addChild(this.notes)

    for (const note of this.song.notes) {
      this.notes.addChild(new NoteSprite(note))
      this.receptors.addChild(new ReceptorSprite(note, this.song))
    }
  }

  update(dt: number) {
    this.song.time += dt
    this.notes.y = this.song.time * noteSpacing
    this.explosions.children.forEach(anim => (anim as NoteExplosionSprite).update(dt))
    this.receptors.children.forEach(rec => (rec as ReceptorSprite).update())
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const note = this.tryTapNote(event.data.global)
    if (note) {
      this.explosions.addChild(new NoteExplosionSprite(note.screenPosition.x, receptorPosition))
    }
  }

  draw(renderer: pixi.SystemRenderer) {
    renderer.render(this.stage)
  }

  tryTapNote(touch: pixi.Point) {
    for (const sprite of this.notes.children as NoteSprite[]) {
      const note = sprite.note

      const isActive = note.state === NoteState.active
      const touchDistance = Math.abs(note.screenPosition.x - touch.x)
      const touchTiming = Math.abs(this.song.time - note.time)

      if (isActive && touchDistance < 80 && touchTiming < 0.25) {
        note.state = NoteState.hit
        sprite.destroy()
        return note
      }
    }
    return null
  }
}
