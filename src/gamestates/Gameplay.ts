import {GameState} from '../game'
import * as constants from '../constants'
import * as pixi from 'pixi.js'
import * as util from '../util'
import NoteExplosionSprite from '../sprites/NoteExplosionSprite'
import NoteSprite from '../sprites/NoteSprite'
import PlayfieldSprite from '../sprites/PlayfieldSprite'
import Tween from '../Tween'

const enum Judgement {
  absolute,
  perfect,
  great,
  bad,
  none,
}

const enum NoteState {
  active,
  hit,
  missed,
  holding,
}

type NoteData = {
  time: number
  position: number
}

type SongData = {
  title: string
  artist: string
  notes: NoteData[]
}

abstract class Actor extends pixi.Container {
  abstract update(dt: number): void
}

class Note {
  sprite = new NoteSprite()
  state = NoteState.active
  constructor(public data: NoteData) {}
}

class NoteExplosionAnimation extends Actor {
  sprite = this.addChild(new NoteExplosionSprite())
  bounce = new Tween(0, 80, 0.3, v => v ** 2)
  fade = new Tween(1, 0, 0.3)
  time = 0

  constructor(x: number, y: number) {
    super()
    this.position.set(x, y)
  }

  update(dt: number) {
    this.time += dt
    if (this.time < 0.3) {
      this.sprite.y = this.bounce.set(this.time)
      this.sprite.alpha = this.fade.set(this.time)
    } else {
      this.destroy()
    }
  }
}

class Gameplay extends GameState {
  song: SongData = {
    title: 'test song',
    artist: 'test artist',
    notes: [
      { time: 0 / 2, position: 0 / 4 },
      { time: 1 / 2, position: 1 / 4 },
      { time: 2 / 2, position: 2 / 4 },
      { time: 3 / 2, position: 3 / 4 },
      { time: 4 / 2, position: 4 / 4 },
    ]
  }

  stage = new pixi.Container()
  noteLayer = new pixi.Container()
  notes = [] as Note[]

  songTime = -constants.songStartDelay

  constructor() {
    super()

    for (const data of this.song.notes) {
      const note = new Note(data)
      note.sprite.x = util.lerp(constants.trackMargin, constants.viewWidth - constants.trackMargin, data.position)
      note.sprite.y = util.lerp(0, -constants.noteSpacing, data.time)
      this.noteLayer.addChild(note.sprite)
      this.notes.push(note)
    }

    this.stage.addChild(new PlayfieldSprite())
    this.stage.addChild(this.noteLayer)
  }

  update(dt: number) {
    this.songTime += dt
    this.noteLayer.y = constants.receptorPosition + this.songTime * constants.noteSpacing

    for (const item of this.stage.children) {
      if (item instanceof Actor) {
        item.update(dt)
      }
    }
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    this.tryTapNote(event.data.global)
  }

  tryTapNote(touch: pixi.Point) {
    for (const note of this.notes) {
      const touchDistance = Math.abs(note.sprite.x - touch.x)
      const timing = this.songTime - note.data.time
      const judgement = this.getJudgement(timing)

      if (note.state !== NoteState.active) continue
      if (touchDistance > constants.maxTapDistance) continue
      if (judgement === Judgement.none) continue

      note.state = NoteState.hit
      note.sprite.alpha = 0

      this.stage.addChild(new NoteExplosionAnimation(note.sprite.x, constants.receptorPosition))

      break
    }
  }

  getJudgement(timing: number) {
    if (timing <= constants.timingWindowAbsolute) return Judgement.absolute
    else if (timing <= constants.timingWindowPerfect) return Judgement.perfect
    else if (timing <= constants.timingWindowGreat) return Judgement.great
    else if (timing <= constants.timingWindowBad) return Judgement.bad
    else return Judgement.none
  }

  render(renderer: pixi.WebGLRenderer | pixi.CanvasRenderer) {
    renderer.render(this.stage)
  }
}

export default Gameplay
