import * as graphics from './graphics'
import * as color from './color'
import * as util from './util'
import {Point} from './point'

export const noteScale = 300
export const trackLeft = 100
export const trackRight = 100
export const viewHeight = 1280
export const viewWidth = 720
export const receptorPosition = viewHeight - 210

enum NoteState { active, hit, missed, holding }

interface Drawable {
  draw(c: CanvasRenderingContext2D): void
}

interface Animation extends Drawable {
  time: number
  update(dt: number): this
  isFinished(): boolean
}

class Note implements Drawable {
  state = NoteState.active

  constructor(public time: number, public position: number) {}

  getScreenPosition(): Point {
    const x = util.lerp(trackLeft, viewWidth - trackRight, this.position)
    const y = util.lerp(receptorPosition, receptorPosition - noteScale, this.time)
    return new Point(x, y)
  }

  draw(c: CanvasRenderingContext2D) {
    const pos = this.getScreenPosition()
    graphics.applyCenteredRotation(45, pos, c, () => {
      graphics.rectangle(c, -25, -25, 50).fill(color.white)
      graphics.rectangle(c, -30, -30, 60).stroke(color.white.fade(0.7), 2)
    })
  }
}

class NoteHitAnimation implements Animation {
  time = 0

  constructor(public pos: Point) {}

  update(dt: number): this {
    this.time += dt * 2
    return this
  }

  isFinished(): boolean {
    return this.time >= 1
  }

  draw(c: CanvasRenderingContext2D) {
    const drift = this.time ** 2 * 200
    const opacity = 1 - util.clamp(this.time, 0, 1) ** 1.7
    const glowAmount = (1 - this.time ** 2) * 75

    const pos = this.pos.add(new Point(0, drift))
    const glowColor = color.white.fade(opacity)

    graphics.applyShadow(c, glowColor, glowAmount, 0, 0, () => {
      graphics.applyCenteredRotation(45, pos, c, () => {
        graphics.rectangle(c, -30, -30, 60).fill(glowColor)
      })
    })
  }
}

export class Game {
  notes = [] as Note[]
  animations = [] as Animation[]
  songTime = -2

  constructor() {
    graphics.setDimensions(viewWidth, viewHeight)
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
    const px = event.offsetX / width * viewWidth
    const py = event.offsetY / height * viewHeight

    for (let i = 0; i < this.notes.length; i++) {
      const note = this.notes[i]
      const pos = note.getScreenPosition().x
      const goodTiming = Math.abs(note.time - this.songTime) < 0.1
      const goodPosition = pos - px < 100

      if (goodTiming && goodPosition) {
        this.notes.splice(i, 1)
        this.animations.push(new NoteHitAnimation(new Point(pos, receptorPosition)))
        break
      }
    }
  }

  draw() {
    graphics.drawFrame(c => {
      graphics.applyTranslation(c, 0, this.songTime * noteScale, () => {
        this.notes.forEach(n => n.draw(c))
      })
      this.drawReceptor(c)
      this.animations.forEach(a => a.draw(c))
    })
  }

  drawReceptor(c: CanvasRenderingContext2D) {
    c.fillStyle = color.white.fade(0.5).toString()
    c.fillRect(0, receptorPosition - 5, viewWidth, 10)
  }
}
