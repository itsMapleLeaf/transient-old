import * as graphics from './graphics'
import * as color from './color'
import * as util from './util'
import {Point} from './point'

enum NoteState { active, hit, missed, holding }

class Note {
  state = NoteState.active

  constructor(public time: number, public position: number) {}

  getScreenPosition(songTime: number): Point {
    const x = util.lerp(Game.trackLeft, Game.viewWidth - Game.trackRight, this.position)
    const y = util.lerp(Game.receptorPosition, Game.receptorPosition - Game.noteScale, this.time - songTime)
    return new Point(x, y)
  }

  draw(c: CanvasRenderingContext2D, songTime: number) {
    const pos = this.getScreenPosition(songTime)

    graphics.applyCenteredRotation(45, pos, c, () => {
      graphics.rectangle(c, -25, -25, 50).fill(color.white)
      graphics.rectangle(c, -30, -30, 60).stroke(color.white.fade(0.7), 2)
    })
  }
}

abstract class Animation {
  time = 0

  update(dt: number): this {
    this.time += dt
    return this
  }

  isFinished(): boolean {
    return this.time >= 1
  }

  abstract draw(c: CanvasRenderingContext2D): void
}

class NoteHitAnimation extends Animation {
  constructor(public pos: Point) {
    super()
  }

  update(dt: number): this {
    super.update(dt * 2)
    return this
  }

  draw(c: CanvasRenderingContext2D) {
    const drift = this.time ** 2 * 200
    const opacity = 1 - util.clamp(this.time, 0, 1) ** 1.7
    const glowAmount = (1 - this.time ** 2) * 75

    const pos = this.pos.add(new Point(0, drift))
    const glowColor = color.white.fade(opacity)

    c.save()

    c.fillStyle = glowColor.toString()
    c.shadowBlur = glowAmount
    c.shadowColor = glowColor.toString()

    graphics.applyCenteredRotation(45, pos, c, () => {
      graphics.rectangle(c, -30, -30, 60).fill(glowColor)
    })

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
  animations = [] as Animation[]
  songTime = -2

  constructor() {
    graphics.setDimensions(Game.viewWidth, Game.viewHeight)
    graphics.setBackgroundColor(color.black)

    this.notes.push(new Note(0 / 2, 0 / 4))
    this.notes.push(new Note(1 / 2, 1 / 4))
    this.notes.push(new Note(2 / 2, 2 / 4))
    this.notes.push(new Note(3 / 2, 3 / 4))
    this.notes.push(new Note(4 / 2, 4 / 4))
  }

  update(dt: number) {
    this.songTime += dt
    this.animations = this.animations
      .map(anim => anim.update(dt))
      .filter(anim => !anim.isFinished())
  }

  pointerdown(event: PointerEvent) {
    const {width, height} = graphics.canvas.getBoundingClientRect()
    const px = event.offsetX / width * Game.viewWidth
    const py = event.offsetY / height * Game.viewHeight

    for (let i = 0; i < this.notes.length; i++) {
      const note = this.notes[i]
      const pos = note.getScreenPosition(this.songTime)
      const goodTiming = Math.abs(note.time - this.songTime) < 0.1
      const goodPosition = pos.x - px < 100

      if (goodTiming && goodPosition) {
        this.notes.splice(i, 1)
        this.animations.push(new NoteHitAnimation(new Point(pos.x, Game.receptorPosition)))
        break
      }
    }
  }

  draw() {
    graphics.drawFrame(c => {
      this.notes.forEach(n => n.draw(c, this.songTime))
      this.drawReceptor(c)
      this.animations.forEach(a => a.draw(c))
    })
  }

  drawReceptor(c: CanvasRenderingContext2D) {
    c.fillStyle = color.white.fade(0.5).toString()
    c.fillRect(0, Game.receptorPosition - 5, Game.viewWidth, 10)
  }
}
