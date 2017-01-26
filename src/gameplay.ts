import {GameState} from './game'
import * as pixi from 'pixi.js'
import * as songman from './song-manager'
import * as util from './util'
// import {Howl} from 'howler'

export const viewWidth = 540
export const viewHeight = 960
export const receptorPosition = viewHeight * 0.889
export const noteSpacing = 300

enum NoteState {
  active,
  hit,
  missed,
  holding,
}

enum Judgement {
  absolute,
  perfect,
  great,
  bad,
  none,
  // TODO: account for misses
}

function getTexture(name: string) {
  return pixi.loader.resources[name].texture
}

function judgeTiming(timing: number) {
  timing = Math.abs(timing)
  return (
    timing <= 0.02 ? Judgement.absolute :
    timing <= 0.08 ? Judgement.perfect :
    timing <= 0.12 ? Judgement.great :
    timing <= 0.25 ? Judgement.bad :
    Judgement.none
  )
}

export class GameplayState extends GameState {
  // song = new Song('frigid')
  // audio: Howl

  // game state
  songTime = 0
  playing = false

  // rendering stuff
  stage = new pixi.Container()
  receptors = new pixi.Container()
  explosions = new pixi.Container()
  notes = new pixi.Container()
  judgement = new JudgementSprite()
  combo = new ComboSprite()

  constructor() {
    super()

    const song = songman.loadSong('frigid')

    for (const [time, position] of song.notes) {
      const note = this.notes.addChild(new NoteSprite(new NoteData(time, position)))
      this.receptors.addChild(new ReceptorSprite(note.x, receptorPosition, time))
    }

    // insert containers manually to ensure proper draw order
    this.stage.addChild(new pixi.Sprite(getTexture('background')))
    this.stage.addChild(this.receptors)
    this.stage.addChild(this.explosions)
    this.stage.addChild(this.notes)
    this.stage.addChild(this.combo)
    this.stage.addChild(this.judgement)

    this.playing = true
  }

  update(dt: number) {
    this.songTime += dt
    this.notes.y = this.songTime * noteSpacing

    this.judgement.update(dt)
    this.combo.update(dt)
    for (const exp of this.explosions.children as NoteExplosionSprite[]) exp.update(dt)
    for (const rec of this.receptors.children as ReceptorSprite[]) rec.update(this.songTime)
  }

  draw(renderer: pixi.SystemRenderer) {
    renderer.render(this.stage)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    this.tryTapNote(event.data.global, (note, timing) => {
      this.explosions.addChild(new NoteExplosionSprite(note.x, receptorPosition))

      const judgement = judgeTiming(timing)
      this.judgement.playJudgement(judgement)
      if (judgement < Judgement.bad) {
        this.combo.add(1)
      }
    })
  }

  tryTapNote(touch: pixi.Point, callback: (note: NoteSprite, timing: number) => any) {
    for (const note of this.notes.children as NoteSprite[]) {
      const isActive = note.state === NoteState.active
      const touchDistance = Math.abs(note.x - touch.x)
      const touchTiming = Math.abs(this.songTime - note.time)

      if (isActive && touchDistance < 80 && touchTiming < 0.25) {
        note.state = NoteState.hit
        note.visible = false
        callback(note, touchTiming)
        break
      }
    }
  }
}

class NoteData {
  constructor(public time: number, public position: number) {}
}

class NoteSprite extends pixi.Sprite {
  time = 0
  state = NoteState.active

  constructor(data: NoteData) {
    super(getTexture('note'))
    this.position.x = util.lerp(110, viewWidth - 110, data.position)
    this.position.y = receptorPosition + data.time * -noteSpacing
    this.pivot.set(this.width / 2, this.height / 2)
    this.time = data.time
  }
}

class NoteExplosionSprite extends pixi.Sprite {
  time = 0
  origin = new pixi.Point()

  constructor(public x: number, public y: number) {
    super(getTexture('explosion'))
    this.pivot.set(this.width / 2, this.height / 2)
    this.origin.set(x, y)
  }

  update(dt: number) {
    this.time += dt * 3
    if (this.time < 1) {
      this.alpha = 1 - this.time
      this.position.x = this.origin.x
      this.position.y = this.origin.y + this.time ** 2.5 * 80
    } else {
      this.destroy()
    }
  }
}

class ReceptorSprite extends pixi.Sprite {
  constructor(x: number, y: number, public time: number) {
    super(getTexture('receptor'))
    this.position.set(x, y)
    this.pivot.set(this.width / 2, this.height / 2)
  }

  update(songTime: number) {
    if (songTime < this.time) {
      this.alpha = 1 - Math.abs(songTime - this.time)
    } else {
      this.alpha = 0
    }
  }
}

class JudgementSprite extends pixi.Text {
  judgement = Judgement.none
  time = 0

  constructor() {
    super('', {
      fontFamily: 'Teko',
      fontSize: 100,
    })

    this.position.set(viewWidth / 2, viewHeight * 0.35)
  }

  update(dt: number) {
    this.time += dt

    this.text =
      this.judgement === Judgement.absolute ? 'ABSOLUTE' :
      this.judgement === Judgement.perfect ? 'PERFECT' :
      this.judgement === Judgement.great ? 'GREAT' :
      this.judgement === Judgement.bad ? 'BAD' :
      ''

    this.style.fill =
      this.judgement === Judgement.absolute ? 'rgb(52, 152, 219)' :
      this.judgement === Judgement.perfect ? 'rgb(241, 196, 15)' :
      this.judgement === Judgement.great ? 'rgb(46, 204, 113)' :
      this.judgement === Judgement.bad ? 'rgb(231, 76, 60)' :
      ''

    if (this.judgement < Judgement.bad) {
      this.alpha = 1 - util.delta(this.time, 0.8, 1)
      if (this.judgement === Judgement.absolute) {
        this.alpha *= util.lerp(0.3, 1, Math.sin(this.time * 100) / 2 + 0.5)
      }

      const bounce = 1 - util.clamp(util.delta(this.time, 0, 0.3), 0, 1) ** 0.3 * 25
      this.y = viewHeight * 0.35 + bounce
    } else {
      this.alpha = util.lerp(1, 0, util.clamp(util.delta(this.time, 0.5, 1), 0, 1))
      this.y = viewHeight * 0.35 + util.lerp(0, 40, util.clamp(util.delta(this.time, 0, 1), 0, 1))
    }

    this.pivot.x = this.width / 2
  }

  playJudgement(judgement: Judgement) {
    this.judgement = judgement
    this.time = 0
  }
}

class ComboSprite extends pixi.Text {
  combo = 0
  time = 0

  constructor() {
    super('', {
      fontFamily: 'Teko',
      fontSize: 120,
      fill: 'white'
    })
    this.position.set(viewWidth / 2, viewHeight * 0.2)
  }

  update(dt: number) {
    this.time += dt
    if (this.combo > 0) {
      this.alpha = util.lerp(1, 0.5, util.clamp(util.delta(this.time, 0, 0.3), 0, 1))
    } else {
      this.alpha = 0
    }
    this.text = this.combo.toString()
    this.pivot.x = this.width / 2
  }

  add(combo: number) {
    this.combo += combo
    this.time = 0
  }

  reset() {
    this.combo = 0
  }
}
