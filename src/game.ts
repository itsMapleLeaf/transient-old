import * as pixi from 'pixi.js'
import * as util from './util'

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

interface Updateable {
  update(dt: number): void
}

class Note {
  state = NoteState.active

  constructor(public time: number, public position: number) {}

  get screenPosition() {
    const x = util.lerp(110, viewWidth - 110, this.position)
    const y = receptorPosition + this.time * -noteSpacing
    return new pixi.Point(x, y)
  }
}

class Song {
  time = -2
  notes = [
    new Note(0 / 2, 0 / 4),
    new Note(1 / 2, 1 / 4),
    new Note(2 / 2, 2 / 4),
    new Note(3 / 2, 3 / 4),
    new Note(4 / 2, 4 / 4),
  ]
}

class NoteSprite extends pixi.Sprite {
  constructor(public note: Note) {
    super(getTexture('note'))
    this.position = note.screenPosition
    this.pivot.set(this.width / 2, this.height / 2)
  }
}

class NoteExplosionSprite extends pixi.Sprite implements Updateable {
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

class ReceptorSprite extends pixi.Sprite implements Updateable {
  constructor(public note: Note, public song: Song) {
    super(getTexture('receptor'))
    this.position.set(note.screenPosition.x, receptorPosition)
    this.pivot.set(this.width / 2, this.height / 2)
  }

  update() {
    if (this.song.time < this.note.time && this.note.state === NoteState.active) {
      this.alpha = 1 - Math.abs(this.song.time - this.note.time)
    } else {
      this.alpha = 0
    }
  }
}

class JudgementSprite extends pixi.Text implements Updateable {
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

export default class Game {
  song = new Song()

  stage = new pixi.Container()
  receptors = new pixi.Container()
  explosions = new pixi.Container()
  notes = new pixi.Container()
  judgement = new JudgementSprite()

  constructor() {
    this.stage.addChild(new pixi.Sprite(getTexture('background')))
    this.stage.addChild(this.receptors)
    this.stage.addChild(this.explosions)
    this.stage.addChild(this.notes)
    this.stage.addChild(this.judgement)

    for (const note of this.song.notes) {
      this.notes.addChild(new NoteSprite(note))
      this.receptors.addChild(new ReceptorSprite(note, this.song))
    }
  }

  update(dt: number) {
    this.song.time += dt
    this.notes.y = this.song.time * noteSpacing
    this.judgement.update(dt)
    for (const exp of this.explosions.children as NoteExplosionSprite[]) exp.update(dt)
    for (const rec of this.receptors.children as ReceptorSprite[]) rec.update()
  }

  draw(renderer: pixi.SystemRenderer) {
    renderer.render(this.stage)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    this.tryTapNote(event.data.global, (note, timing) => {
      this.explosions.addChild(new NoteExplosionSprite(note.screenPosition.x, receptorPosition))
      this.judgement.playJudgement(judgeTiming(timing))
    })
  }

  tryTapNote(touch: pixi.Point, callback: (note: Note, timing: number) => any) {
    for (const sprite of this.notes.children as NoteSprite[]) {
      const note = sprite.note

      const isActive = note.state === NoteState.active
      const touchDistance = Math.abs(note.screenPosition.x - touch.x)
      const touchTiming = Math.abs(this.song.time - note.time)

      if (isActive && touchDistance < 80 && touchTiming < 0.25) {
        note.state = NoteState.hit
        sprite.destroy()
        callback(note, touchTiming)
        break
      }
    }
  }
}
