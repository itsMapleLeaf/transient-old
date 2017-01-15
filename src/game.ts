import * as graphics from './graphics'
import * as util from './util'

class Note {
  constructor(public time: number, public position: number) {}

  draw() {
    const x = util.lerp(0, Game.viewWidth, this.position)
    const y = util.lerp(0, Game.noteScale, this.time)
    graphics.rectangle(x, y, 50, 50).fill()
  }
}

export class Game {
  static viewWidth = 720
  static viewHeight = 1280
  static noteScale = 300

  notes = [] as Note[]
  songTime = 0

  constructor() {
    graphics.setDimensions(Game.viewWidth, Game.viewHeight)
    graphics.setBackgroundColor(new graphics.ColorHSL(0, 0, 0))

    this.notes.push(new Note(0 / 2, 0 / 4))
    this.notes.push(new Note(1 / 2, 1 / 4))
    this.notes.push(new Note(2 / 2, 2 / 4))
    this.notes.push(new Note(3 / 2, 3 / 4))
    this.notes.push(new Note(4 / 2, 4 / 4))
  }

  update(dt: number) {}

  keydown(event: KeyboardEvent) {}

  keyup(event: KeyboardEvent) {}

  draw() {
    for (const note of this.notes) {
      note.draw()
    }
  }
}
