import * as pixi from 'pixi.js'

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

class Note {
  state = NoteState.active

  constructor(public time: number, public position: number) {}

  render() {
    if (this.state === NoteState.active) {
      const pos = getScreenPosition(this)
      return createNoteSprite(pos.x, pos.y)
    }
    return undefined
  }
}

class NoteExplosionAnimation {
  time = 0

  constructor(public x: number, public y: number) {}

  render() {
    const sprite = createExplosionSprite(this.x, this.y)
    sprite.y += this.time ** 2.5 * 80
    sprite.alpha = 1 - this.time
    return sprite
  }
}

function createSprite(textureName: string, x = 0, y = 0) {
  const sprite = new pixi.Sprite(pixi.loader.resources[textureName].texture)
  sprite.position.set(x, y)
  pivotToCenter(sprite)
  return sprite
}

function createBackgroundSprite() {
  return createSprite('background', viewWidth / 2, viewHeight / 2)
}

function createNoteSprite(x: number, y: number) {
  return createSprite('note', x, y)
}

function createReceptorSprite(x: number, y: number, alpha: number) {
  const sprite = createSprite('receptor', x, y)
  sprite.alpha = alpha
  return sprite
}

function createExplosionSprite(x: number, y: number) {
  return createSprite('explosion', x, y)
}

function pivotToCenter(sprite: pixi.Sprite) {
  sprite.pivot.set(sprite.width / 2, sprite.height / 2)
  return sprite
}

function getScreenPosition(note: Note) {
  const x = 110 + note.position * (viewWidth - 220)
  const y = note.time * -noteSpacing
  return new pixi.Point(x, y)
}

function getTrackOffset(songTime: number) {
  return receptorPosition + songTime * noteSpacing
}

function updateNoteContainerPosition(songTime: number, container: pixi.Container) {
  container.y = getTrackOffset(songTime)
}

function updateNoteExplosions(dt: number, explosions: NoteExplosionAnimation[]) {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const anim = explosions[i]
    anim.time += dt * 3
    if (anim.time > 1) {
      explosions.splice(i, 1)
    }
  }
}

function renderReceptor(songTime: number, note: Note) {
  const pos = getScreenPosition(note)
  if (pos.y + getTrackOffset(songTime) < receptorPosition && note.state === NoteState.active) {
    const alpha = 1 - Math.abs(songTime - note.time)
    return createReceptorSprite(pos.x, receptorPosition, alpha)
  }
  return undefined
}

function renderCollection<T>(items: T[], renderer: (item: T) => pixi.DisplayObject | void, subject: pixi.Container) {
  subject.removeChildren()
  items.forEach(item => {
    const sprite = renderer(item)
    if (sprite) subject.addChild(sprite)
  })
}

function tryTapNote(notes: Note[], songTime: number, touch: pixi.Point) {
  for (const note of notes) {
    const pos = getScreenPosition(note)
    const isActive = note.state === NoteState.active
    const touchDistance = Math.abs(pos.x - touch.x)
    const touchTiming = Math.abs(songTime - note.time)
    if (isActive && touchDistance < 80 && touchTiming < 0.25) {
      note.state = NoteState.hit
      return note
    }
  }
  return null
}

export default class Game {
  notes = [
    new Note(0 / 2, 0 / 4),
    new Note(1 / 2, 1 / 4),
    new Note(2 / 2, 2 / 4),
    new Note(3 / 2, 3 / 4),
    new Note(4 / 2, 4 / 4),
  ]

  explosions = [] as NoteExplosionAnimation[]

  stage = new pixi.Container()
  noteContainer = new pixi.Container()
  receptorContainer = new pixi.Container()
  explosionContainer = new pixi.Container()
  backgroundSprite = createBackgroundSprite()

  songTime = -2

  constructor() {
    this.stage.addChild(this.backgroundSprite)
    this.stage.addChild(this.receptorContainer)
    this.stage.addChild(this.explosionContainer)
    this.stage.addChild(this.noteContainer)
  }

  update(dt: number) {
    this.songTime += dt
    updateNoteContainerPosition(this.songTime, this.noteContainer)
    updateNoteExplosions(dt, this.explosions)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const note = tryTapNote(this.notes, this.songTime, event.data.global)
    if (note) {
      const pos = getScreenPosition(note)
      this.explosions.push(new NoteExplosionAnimation(pos.x, receptorPosition))
    }
  }

  draw(renderer: pixi.SystemRenderer) {
    renderCollection(this.notes, note => note.render(), this.noteContainer)
    renderCollection(this.explosions, anim => anim.render(), this.explosionContainer)
    renderCollection(this.notes, rec => renderReceptor(this.songTime, rec), this.receptorContainer)
    renderer.render(this.stage)
  }
}
