import * as graphics from './graphics'
import {Rectangle, ColorHSL} from './graphics'
import * as util from './util'

class Note {
  body = new Rectangle(0, 0, 60)
  .setAngle(45)
  .setColor(new ColorHSL(1, 1, 1, 1))

  outline = new Rectangle(0, 0, 70)
  .setAngle(45)
  .setColor(new ColorHSL(1, 1, 1, 0.7))

  constructor(public time: number, public position: number) {}

  getScreenPosition(songTime: number) {
    const x = util.lerp(Game.trackLeft, Game.viewWidth - Game.trackRight, this.position)
    const y = util.lerp(Game.receptorPosition, Game.receptorPosition - Game.noteScale, this.time - songTime)
    return [x, y]
  }

  draw(songTime: number) {
    const [x, y] = this.getScreenPosition(songTime)
    this.body.setPosition(x, y).fill()
    this.outline.setPosition(x, y).stroke(2)
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

  receptor = new Rectangle(0, Game.receptorPosition, Game.viewWidth, 10)
  .setColor(new ColorHSL(1, 1, 1, 0.5))
  .setAlign(0, 0.5)

  constructor() {
    graphics.setDimensions(Game.viewWidth, Game.viewHeight)
    graphics.setBackgroundColor(new ColorHSL(0, 0, 0))

    this.notes.push(new Note(0 / 2, 0 / 4))
    this.notes.push(new Note(1 / 2, 1 / 4))
    this.notes.push(new Note(2 / 2, 2 / 4))
    this.notes.push(new Note(3 / 2, 3 / 4))
    this.notes.push(new Note(4 / 2, 4 / 4))
  }

  update(dt: number) {
    this.songTime += dt
  }

  keydown(event: KeyboardEvent) {}

  keyup(event: KeyboardEvent) {}

  draw() {
    graphics.clear()
    for (const note of this.notes) {
      note.draw(this.songTime)
    }
    this.receptor.fill()
  }
}
