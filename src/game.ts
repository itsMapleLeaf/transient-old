import * as pixi from 'pixi.js'

export const viewWidth = 540
export const viewHeight = 960
export const receptorPosition = viewHeight * 0.889
export const noteSpacing = 300

const enum NoteState { active, hit, missed, holding }

class NoteData {
  constructor(public time: number, public position: number) {}

  getScreenPosition() {
    const x = 110 + this.position * (viewWidth - 220)
    const y = -noteSpacing * this.time
    return new pixi.Point(x, y)
  }
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
    this.position = data.getScreenPosition()
    this.pivot.set(this.width / 2, this.height / 2)
  }
}

class Receptor extends pixi.Sprite {
  constructor(public note: Note) {
    super(pixi.loader.resources['note-receptor'].texture)
  }

  update() {
    this.x = this.note.x
    this.y = receptorPosition
    this.pivot.set(this.width / 2, this.height / 2)

    const pos = this.note.getGlobalPosition()
    if (pos.y < this.y && this.note.state === NoteState.active) {
      this.alpha = 1 - (this.y - pos.y) / 200
    } else {
      this.alpha = 0
    }
  }
}

class NoteManager extends pixi.Container {
  children: Note[]

  constructor(notes: NoteData[]) {
    super()
    for (const note of notes.reverse()) {
      this.addChild(new Note(note))
    }
  }

  updateNotePosition(songTime: number) {
    this.y = receptorPosition + noteSpacing * songTime
  }

  handleTouch(touch: pixi.Point, songTime: number) {
    for (const note of this.children) {
      const touchDistance = Math.abs(touch.x - note.x)
      const touchTiming = Math.abs(songTime - note.data.time)
      const isActive = note.state === NoteState.active

      if (isActive && touchDistance < 80 && touchTiming < 0.2) {
        note.state = NoteState.hit
        note.alpha = 0
      }
    }
  }
}

class ReceptorManager extends pixi.Container {
  children: Receptor[]

  constructor(notes: Note[]) {
    super()
    for (const note of notes) this.addChild(new Receptor(note))
  }

  updateReceptors() {
    for (const receptor of this.children) {
      receptor.update()
    }
  }
}

class SongState {
  time = -2
}

const song = {
  notes: [
    new NoteData(0 / 2, 0 / 4),
    new NoteData(1 / 2, 1 / 4),
    new NoteData(2 / 2, 2 / 4),
    new NoteData(3 / 2, 3 / 4),
    new NoteData(4 / 2, 4 / 4),
  ]
}

export class Game {
  song = new SongState()

  stage = new pixi.Container()
  notes = new NoteManager(song.notes)
  receptors = new ReceptorManager(this.notes.children)

  interaction = new pixi.interaction.InteractionManager(this.renderer)

  constructor(public renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    this.stage.addChild(new Background())
    this.stage.addChild(this.receptors)
    this.stage.addChild(this.notes)

    this.interaction.on('pointerdown', (event: pixi.interaction.InteractionEvent) => this.pointerdown(event))
  }

  update(dt: number) {
    this.song.time += dt
    this.notes.updateNotePosition(this.song.time)
    this.receptors.updateReceptors()
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    this.notes.handleTouch(event.data.global, this.song.time)
  }

  draw() {
    this.renderer.render(this.stage)
  }
}
