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

class Song {
  time = -2

  update(dt: number) {
    this.time += dt
  }
}

class NoteData {
  constructor(public time: number, public position: number) {}
}

class Background extends pixi.Sprite {
  constructor() {
    super(pixi.loader.resources['background'].texture)
  }
}

class Note extends pixi.Sprite {
  state = NoteState.active

  constructor(public data: NoteData) {
    super(pixi.loader.resources['note'].texture)

    this.x = util.lerp(110, viewWidth - 110, data.position)
    this.y = receptorPosition - data.time * noteSpacing
    this.pivot.set(this.width / 2, this.height / 2)

    this.on('added', () => {
      const parent = this.parent
      parent.on('update', this.update, this)
      this.on('removed', () => {
        parent.off('update', this.update)
      })
    })
  }

  update(dt: number, song: Song) {
    if (this.state !== NoteState.active) this.alpha = 0
    this.y = receptorPosition - (this.data.time - song.time) * noteSpacing
  }
}

class Receptor extends pixi.Sprite {
  constructor(public note: Note) {
    super(pixi.loader.resources['receptor'].texture)

    this.x = note.x
    this.y = receptorPosition
    this.pivot.set(this.width / 2, this.height / 2)

    this.on('added', () => {
      const parent = this.parent
      parent.on('update', this.update, this)
      this.on('removed', () => {
        parent.off('update', this.update)
      })
    })
  }

  update(dt: number, song: Song) {
    if (this.note.y < this.y && this.note.state === NoteState.active) {
      this.visible = true
      this.alpha = 1 - Math.abs(this.note.y - this.y) / 400
    } else {
      this.visible = false
    }
  }
}

class NoteExplosion extends pixi.Sprite {
  time = 0

  constructor(public startX: number, public startY: number) {
    super(pixi.loader.resources['explosion'].texture)

    this.x = startX
    this.y = startY
    this.pivot.set(this.width / 2, this.height / 2)

    this.on('added', () => {
      const parent = this.parent
      parent.on('update', this.update, this)
      this.on('removed', () => {
        parent.off('update', this.update)
      })
    })
  }

  update(dt: number, song: Song) {
    this.time += dt * 3
    if (this.time < 1) {
      this.alpha = 1 - this.time
      this.y = this.startY + this.time ** 2.5 * 80
    } else {
      this.destroy()
    }
  }
}

export default class Game {
  song = new Song()
  stage = new pixi.Container()
  notes = new pixi.Container()

  constructor() {
    const notes = [
      new NoteData(0 / 2, 0 / 4),
      new NoteData(1 / 2, 1 / 4),
      new NoteData(2 / 2, 2 / 4),
      new NoteData(3 / 2, 3 / 4),
      new NoteData(4 / 2, 4 / 4),
    ]

    this.stage.addChild(new Background())

    for (const data of notes) {
      const note = new Note(data)
      this.stage.addChild(new Receptor(note))
      this.notes.addChild(note)
    }

    this.stage.addChild(this.notes)
  }

  update(dt: number) {
    this.song.update(dt)
    this.stage.emit('update', dt, this.song)
    this.notes.emit('update', dt, this.song)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const note = this.tryTapNote(event.data.global)
    if (note) {
      this.stage.addChild(new NoteExplosion(note.x, receptorPosition))
    }
  }

  tryTapNote(touch: pixi.Point) {
    for (const note of this.notes.children as Note[]) {
      const isActive = note.state === NoteState.active
      const touchDistance = Math.abs(note.x - touch.x)
      const touchTiming = Math.abs(this.song.time - note.data.time)
      if (isActive && touchDistance < 80 && touchTiming < 0.25) {
        note.state = NoteState.hit
        return note
      }
    }
    return null
  }

  draw(renderer: pixi.SystemRenderer) {
    renderer.render(this.stage)
  }
}
