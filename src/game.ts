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

enum NoteState {
  active,
  hit,
  missed,
  holding,
}

enum NoteJudgement {
  absolute,
  perfect,
  great,
  bad,
  none,
}

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

class JudgementAnimation implements Animation {
  time = 0

  constructor(public judgement: NoteJudgement) {}

  update(dt: number) {
    this.time += dt
    return this
  }

  isFinished() {
    return this.time >= 1.3
  }

  draw(c: CanvasRenderingContext2D) {
    const text =
      this.judgement === NoteJudgement.absolute ? 'ABSOLUTE' :
      this.judgement === NoteJudgement.perfect ? 'PERFECT' :
      this.judgement === NoteJudgement.great ? 'GREAT' :
      this.judgement === NoteJudgement.bad ? 'BAD' :
      ''

    const offset = (1 - util.clamp(this.time * 4, 0, 1) ** 0.5) * 32
    const opacity = 1 - util.delta(this.time, 1, 1.3)
    const judgeColor = color.white.fade(util.clamp(opacity, 0, 1))

    graphics.applyShadow(c, judgeColor.fade(0.3), 20, 0, 0, () => {
      c.font = '80px Roboto Condensed'
      c.textAlign = 'center'
      c.fillStyle = judgeColor.toString()
      c.fillText(text, viewWidth / 2, viewHeight * 0.3 + offset)
    })
  }
}

export class Game {
  notes = [] as Note[]
  animations = [] as Animation[]
  judgement = new JudgementAnimation(NoteJudgement.none)
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
    this.judgement.update(dt)
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
      const timing = Math.abs(note.time - this.songTime)
      const tapDistance = pos - px

      if (tapDistance < 100) {
        const judgement =
          timing <= 0.015 ? NoteJudgement.absolute :
          timing <= 0.08 ? NoteJudgement.perfect :
          timing <= 0.12 ? NoteJudgement.great :
          timing <= 0.2 ? NoteJudgement.bad :
          NoteJudgement.none

        if (judgement < NoteJudgement.none) {
          this.notes.splice(i, 1)
          this.animations.push(new NoteHitAnimation(new Point(pos, receptorPosition)))
          this.judgement = new JudgementAnimation(judgement)
        }
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
      this.judgement.draw(c)
    })
  }

  drawReceptor(c: CanvasRenderingContext2D) {
    c.fillStyle = color.white.fade(0.5).toString()
    c.fillRect(0, receptorPosition - 5, viewWidth, 10)
  }
}
