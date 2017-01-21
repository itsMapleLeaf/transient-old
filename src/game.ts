import * as pixi from 'pixi.js'

export const viewWidth = 540
export const viewHeight = 960
export const receptorPosition = viewHeight * 0.889
export const noteSpacing = 300

const song = {
  notes: [
    { time: 0 / 2, position: 0 / 4 },
    { time: 1 / 2, position: 1 / 4 },
    { time: 2 / 2, position: 2 / 4 },
    { time: 3 / 2, position: 3 / 4 },
    { time: 4 / 2, position: 4 / 4 },
  ]
}

type NoteData = { time: number, position: number }

const enum NoteState { active, hit, missed, holding }

class Background extends pixi.Sprite {
  constructor() {
    super(pixi.loader.resources['background'].texture)
  }
}

class Note extends pixi.Sprite {
  state = NoteState.active

  constructor(public data: NoteData) {
    super(pixi.loader.resources['note'].texture)
    this.x = 120 + data.position * (viewWidth - 240)
    this.y = -noteSpacing * data.time
    this.pivot.set(this.width / 2, this.height / 2)
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

class SongState {
  time = -2
}

export class Game {
  song = new SongState()

  stage = new pixi.Container()
  notes: NoteManager
  interaction = new pixi.interaction.InteractionManager(this.renderer)

  constructor(public renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    this.stage.addChild(new Background())
    this.notes = this.stage.addChild(new NoteManager(song.notes))

    this.interaction.on('pointerdown', (event: pixi.interaction.InteractionEvent) => this.pointerdown(event))
  }

  update(dt: number) {
    this.song.time += dt
    this.notes.updateNotePosition(this.song.time)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    this.notes.handleTouch(event.data.global, this.song.time)
  }

  draw() {
    this.renderer.render(this.stage)
  }
}
