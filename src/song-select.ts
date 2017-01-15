import {Color} from './color'
import {GameState} from './game'
import * as graphics from './graphics'

const songs = [
  {
    title: 'Frigid',
    artist: 'just nobody',
    notes: [
      [0.0, 0.00],
      [0.5, 0.25],
      [1.0, 0.50],
      [1.5, 0.75],
      [2.0, 1.00],
    ]
  },
  {
    title: 'Frigid',
    artist: 'just nobody',
    notes: [
      [0.0, 0.00],
      [0.5, 0.25],
      [1.0, 0.50],
      [1.5, 0.75],
      [2.0, 1.00],
    ]
  },
  {
    title: 'Frigid',
    artist: 'just nobody',
    notes: [
      [0.0, 0.00],
      [0.5, 0.25],
      [1.0, 0.50],
      [1.5, 0.75],
      [2.0, 1.00],
    ]
  },
]

export class SongSelect implements GameState {
  update(dt: number) {
    return this
  }

  draw(c: CanvasRenderingContext2D) {
    const cardSize = 450

    c.save()
    c.translate(graphics.getWidth() / 2 - cardSize / 2, graphics.getHeight() / 2 - cardSize / 2)

    for (const song of songs) {
      graphics.rectangle(c, 0, 0, cardSize).stroke(Color.white, 1)
      graphics.rectangle(c, -5, -5, cardSize + 10).stroke(Color.white, 1)

      c.fillStyle = Color.white.toString()
      c.textAlign = 'center'
      c.font = '80px Roboto Condensed'
      c.fillText(song.title, cardSize / 2, cardSize * 0.5)
      c.font = '54px Roboto Condensed'
      c.fillText(song.artist, cardSize / 2, cardSize * 0.65)

      c.translate(0, cardSize + 24)
    }
    c.restore()
  }

  pointerdown(event: PointerEvent) {}
}
