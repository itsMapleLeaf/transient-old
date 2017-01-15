import {Game} from './game'
import * as color from './color'
import * as graphics from './graphics'
import * as point from './point'
import * as rect from './rect'
import * as util from './util'

export type Note = {
  time: number
  position: number
}

export type ExplosionAnimation = {
  time: number
  origin: point.Point
}

export function getScreenPosition(note: Note, songTime: number): point.Point {
  const x = util.lerp(Game.trackLeft, Game.viewWidth - Game.trackRight, note.position)
  const y = util.lerp(Game.receptorPosition, Game.receptorPosition - Game.noteScale, note.time - songTime)
  return {x, y}
}

export function draw(c: CanvasRenderingContext2D, note: Note, songTime: number) {
  const pos = getScreenPosition(note, songTime)

  c.fillStyle = color.toRGBAString(color.white)
  c.strokeStyle = color.toRGBAString(color.fade(color.white, 0.7))
  c.lineWidth = 2

  graphics.applyCenteredRotation(45, pos, c, () => {
    graphics.fillRect(c, rect.square(50))
    graphics.strokeRect(c, rect.square(60))
  })
}

export function drawExplosion(anim: ExplosionAnimation, c: CanvasRenderingContext2D) {
  const drift = anim.time ** 2 * 200
  const opacity = 1 - util.clamp(anim.time, 0, 1) ** 1.7
  const glowAmount = (1 - anim.time ** 2) * 20

  const pos = point.add(anim.origin, 0, drift)
  const explosionColor = color.fade(color.white, opacity)
  const glowColor = color.fade(explosionColor, 0.5)

  c.save()

  c.fillStyle = color.toRGBAString(explosionColor)
  c.shadowBlur = glowAmount
  c.shadowColor = color.toRGBAString(glowColor)

  graphics.applyCenteredRotation(45, pos, c, () => {
    graphics.fillRect(c, rect.square(60))
  })

  c.restore()
}
