import * as graphics from './graphics'
import * as util from './util'

class Note {
  constructor(public time: number, public position: number) {}

  getScreenPosition() {
    const x = util.lerp(Game.trackLeft, Game.viewWidth - Game.trackRight, this.position)
    const y = util.lerp(Game.receptorPosition, Game.receptorPosition - Game.noteScale, this.time)
    return [x, y]
  }

  draw() {
    const [x, y] = this.getScreenPosition()

    new graphics.Rectangle(x, y, 50).setAngle(45)
      .setColor(new graphics.ColorHSL(1, 1, 1, 1))
      .fill()

      .setColor(new graphics.ColorHSL(1, 1, 1, 0.7))
      .setSize(60)
      .stroke(2)
  }
}

export class Game {
  static viewWidth = 720
  static viewHeight = 1280
  static noteScale = 300
  static trackLeft = 100
  static trackRight = 100
  static receptorPosition = Game.viewHeight - 210

  notes = [] as Note[]
  songTime = -3

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
    graphics.clear()

    new graphics.Rectangle(0, Game.receptorPosition, Game.viewWidth, 10)
      .setColor(new graphics.ColorHSL(1, 1, 1, 0.5))
      .setAlign(0, 0.5)
      .fill()

    for (const note of this.notes) {
      note.draw()
    }
  }
}
