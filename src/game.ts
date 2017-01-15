import * as graphics from './graphics'
import * as color from './color'
import * as util from './util'
import * as note from './note'

export class Game {
  static viewWidth = 720
  static viewHeight = 1280
  static noteScale = 300
  static trackLeft = 100
  static trackRight = 100
  static receptorPosition = Game.viewHeight - 210

  notes = [] as note.Note[]
  songTime = -3

  constructor() {
    graphics.setDimensions(Game.viewWidth, Game.viewHeight)
    graphics.setBackgroundColor(color.black)

    this.notes.push({ time: 0 / 2, position: 0 / 4 })
    this.notes.push({ time: 1 / 2, position: 1 / 4 })
    this.notes.push({ time: 2 / 2, position: 2 / 4 })
    this.notes.push({ time: 3 / 2, position: 3 / 4 })
    this.notes.push({ time: 4 / 2, position: 4 / 4 })
  }

  update(dt: number) {
    this.songTime += dt
  }

  keydown(event: KeyboardEvent) {}

  keyup(event: KeyboardEvent) {}

  draw() {
    graphics.drawFrame(c => {
      for (const n of this.notes) {
        note.draw(c, n, this.songTime)
      }
      c.fillStyle = color.toRGBAString(color.fade(color.white, 0.5))
      c.fillRect(0, Game.receptorPosition, Game.viewWidth, 10)
    })
  }
}
