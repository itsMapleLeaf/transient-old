import {Color} from './color'
import {Point} from './point'
import {Note, NoteHitAnimation} from './note'
import {Judgement, JudgementAnimation} from './judgement'
import * as graphics from './graphics'
import * as util from './util'
import {Howl} from 'howler'

declare var require: Function

export const noteSpacing = 300 // pixels per second
export const trackLeft = 100
export const trackRight = 100
export const viewHeight = 1280
export const viewWidth = 720
export const receptorPosition = viewHeight - 210

export interface Drawable {
  draw(c: CanvasRenderingContext2D): void
}

export interface Animation extends Drawable {
  time: number
  update(dt: number): this
  isFinished(): boolean
}

export class Game {
  notes = [] as Note[]
  animations = [] as Animation[]
  judgement = new JudgementAnimation(Judgement.none)
  songTime = -2
  playing = false

  music = new Howl({
    src: [
      require('../songs/frigid/just nobody - Frigid.ogg'),
      require('../songs/frigid/just nobody - Frigid.mp3'),
    ]
  })

  constructor() {
    graphics.setDimensions(viewWidth, viewHeight)
    graphics.setBackgroundColor(Color.black)

    this.notes.push(new Note(0 / 2, 0 / 4))
    this.notes.push(new Note(1 / 2, 1 / 4))
    this.notes.push(new Note(2 / 2, 2 / 4))
    this.notes.push(new Note(3 / 2, 3 / 4))
    this.notes.push(new Note(4 / 2, 4 / 4))

    this.music.once('load', () => {
      this.music.play()
      this.playing = true
    })
  }

  update(dt: number) {
    if (!this.playing) return

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
        const judgement = this.getJudgement(timing)
        if (judgement < Judgement.none) {
          this.notes.splice(i, 1)
          this.animations.push(new NoteHitAnimation(new Point(pos, receptorPosition)))
          this.judgement = new JudgementAnimation(judgement)
        }
        break
      }
    }
  }

  getJudgement(timing: number) {
    return (
      timing <= 0.015 ? Judgement.absolute :
      timing <= 0.08 ? Judgement.perfect :
      timing <= 0.12 ? Judgement.great :
      timing <= 0.2 ? Judgement.bad :
      Judgement.none
    )
  }

  draw() {
    graphics.drawFrame(c => {
      graphics.applyTranslation(c, 0, this.songTime * noteSpacing, () => {
        this.notes.forEach(n => n.draw(c))
      })
      this.drawReceptor(c)
      this.animations.forEach(a => a.draw(c))
      this.judgement.draw(c)
    })
  }

  drawReceptor(c: CanvasRenderingContext2D) {
    c.fillStyle = Color.white.fade(0.5).toString()
    c.fillRect(0, receptorPosition - 5, viewWidth, 10)
  }
}
