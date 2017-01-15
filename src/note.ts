import {Game} from './game'
import {Point} from './point'
import * as color from './color'
import * as graphics from './graphics'
import * as rect from './rect'
import * as util from './util'

export type Note = {
  time: number
  position: number
}

export function getScreenPosition(note: Note, songTime: number): Point {
  const x = util.lerp(Game.trackLeft, Game.viewWidth - Game.trackRight, note.position)
  const y = util.lerp(Game.receptorPosition, Game.receptorPosition - Game.noteScale, note.time - songTime)
  return {x, y}
}

export function draw(c: CanvasRenderingContext2D, note: Note, songTime: number) {
  const {x, y} = getScreenPosition(note, songTime)

  c.fillStyle = color.toRGBAString(color.white)
  c.strokeStyle = color.toRGBAString(color.fade(color.white, 0.7))
  c.lineWidth = 2

  c.save()
  c.translate(x, y)
  c.rotate(util.radians(45))
  graphics.fillRect(c, rect.square(50))
  graphics.strokeRect(c, rect.square(60))
  c.restore()
}
