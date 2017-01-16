import { GameState, viewWidth, viewHeight } from './game'
import { Color } from './color'
import { Howl } from 'howler'
import { Judgement, JudgementAnimation } from './judgement'
import { Note, NoteHitAnimation } from './note'
import { Point } from './point'
import * as graphics from './graphics'
import * as util from './util'

type Animation = NoteHitAnimation | JudgementAnimation

export const noteSpacing = 300 // pixels per second
export const trackLeft = 100
export const trackRight = 100
export const receptorPosition = viewHeight - 210

export class Gameplay extends GameState {
  notes = [] as Note[]
  animations = [] as Animation[]
  judgement = new JudgementAnimation(Judgement.none)
  songTime = -2
  playing = false

  constructor() {
    super()
    graphics.setDimensions(viewWidth, viewHeight)
    graphics.setBackgroundColor(Color.black)
  }

  update(dt: number) {
    if (this.playing) {
      this.songTime += dt
      this.judgement.update(dt)
      this.animations = this.animations
        .map(anim => anim.update(dt))
        .filter(anim => !anim.isFinished())
    }
    return this
  }

  pointerdown(touch: Point, event: PointerEvent) {
    for (let i = 0; i < this.notes.length; i++) {
      const note = this.notes[i]
      const pos = note.getScreenPosition().x
      const timing = Math.abs(note.time - this.songTime)
      const tapDistance = Math.abs(pos - touch.x)

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
    return timing <= 0.015 ? Judgement.absolute
      : timing <= 0.08 ? Judgement.perfect
      : timing <= 0.12 ? Judgement.great
      : timing <= 0.2 ? Judgement.bad
      : Judgement.none
  }

  draw(c: CanvasRenderingContext2D) {
    graphics.applyTranslation(c, 0, this.songTime * noteSpacing, () => {
      this.notes.forEach(n => n.draw(c))
    })
    this.drawReceptor(c)
    this.animations.forEach(a => a.draw(c))
    this.judgement.draw(c)
  }

  drawReceptor(c: CanvasRenderingContext2D) {
    c.fillStyle = Color.white.fade(0.5).toString()
    c.fillRect(0, receptorPosition - 5, viewWidth, 10)
  }
}
