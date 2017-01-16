import {Color} from './color'
import {GameState} from './game'
import {Point} from './point'
import * as graphics from './graphics'
import * as util from './util'

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

// class TouchArea {
//   constructor(
//     public x: number,
//     public y: number,
//     public width: number,
//     public height: number
//   ) {}
// }

export class SongSelect implements GameState {
  scroll = 0
  dragging = false
  lastTouch = new Point(0, 0)
  slide = 0

  update(dt: number) {
    if (!this.dragging) {
      this.scroll -= this.slide
    }
    this.slide = util.lerp(this.slide, 0, dt * 3)
    return this
  }

  draw(c: CanvasRenderingContext2D) {
    const cardSize = 450

    c.save()
    c.translate(graphics.getWidth() / 2 - cardSize / 2, graphics.getHeight() / 2 - cardSize / 2)
    c.translate(0, this.scroll)

    for (const song of songs) {
      graphics.rectangle(c, 0, 0, cardSize).stroke(Color.white, 1)
      graphics.rectangle(c, -5, -5, cardSize + 10).stroke(Color.white, 1)

      c.fillStyle = Color.white.toString()
      c.textAlign = 'center'
      c.font = '80px Fira Sans Extra Condensed'
      c.fillText(song.title, cardSize / 2, cardSize * 0.5)
      c.font = '54px Fira Sans Extra Condensed'
      c.fillText(song.artist, cardSize / 2, cardSize * 0.65)

      c.translate(0, cardSize + 24)
    }
    c.restore()
  }

  pointerdown(touch: Point, event: PointerEvent) {
    this.dragging = true
  }

  pointerup(touch: Point, event: PointerEvent) {
    this.dragging = false
  }

  pointermove(touch: Point, event: PointerEvent) {
    if (this.dragging) {
      const velocity = this.lastTouch.subtract(touch)
      this.scroll -= velocity.y
      this.slide = velocity.y * 2
    }
    this.lastTouch = touch
  }
}
