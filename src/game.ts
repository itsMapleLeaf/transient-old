import * as graphics from './graphics'
import * as util from './util'

type Rectangle = [number, number, number, number]

function square(size: number): Rectangle {
  return [-size / 2, -size / 2, size, size]
}

function fillRect(c: CanvasRenderingContext2D, [x, y, w, h]: Rectangle) {
  c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

function strokeRect(c: CanvasRenderingContext2D, [x, y, w, h]: Rectangle) {
  c.strokeRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

class Note {
  constructor(public time: number, public position: number) {}

  getScreenPosition(songTime: number) {
    const x = util.lerp(Game.trackLeft, Game.viewWidth - Game.trackRight, this.position)
    const y = util.lerp(Game.receptorPosition, Game.receptorPosition - Game.noteScale, this.time - songTime)
    return [x, y]
  }

  draw(c: CanvasRenderingContext2D, songTime: number) {
    const [x, y] = this.getScreenPosition(songTime)

    c.fillStyle = graphics.toRGBAString(graphics.colors.white)
    c.strokeStyle = graphics.toRGBAString(graphics.fade(graphics.colors.white, 0.7))
    c.lineWidth = 2

    c.save()
    c.translate(x, y)
    c.rotate(util.radians(45))
    fillRect(c, square(50))
    strokeRect(c, square(60))
    c.restore()
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
    graphics.setBackgroundColor(graphics.colors.black)

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
    graphics.drawFrame(c => {
      for (const note of this.notes) {
        note.draw(c, this.songTime)
      }
      c.fillStyle = graphics.toRGBAString(graphics.fade(graphics.colors.white, 0.5))
      c.fillRect(0, Game.receptorPosition, Game.viewWidth, 10)
    })
  }
}
