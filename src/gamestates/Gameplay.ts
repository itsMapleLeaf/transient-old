import {GameState} from '../game'
import * as constants from '../constants'
import * as pixi from 'pixi.js'
import * as util from '../util'
import NoteSprite from '../sprites/NoteSprite'
import PlayfieldSprite from '../sprites/PlayfieldSprite'

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

class Note {
  sprite = new NoteSprite()
  state = NoteState.active
  constructor(public data: NoteData) {}
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
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    this.tryTapNote(event.data.global)
  }

  tryTapNote(touch: pixi.Point) {
    for (const note of this.notes) {
      if (note.state === NoteState.active) {
        const touchDistance = Math.abs(note.sprite.x - touch.x)
        const timing = this.songTime - note.data.time
        const judgement = this.getJudgement(timing)
        if (touchDistance <= constants.maxTapDistance && judgement !== Judgement.none) {
          note.state = NoteState.hit
          note.sprite.alpha = 0
          break
        }
      }
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
