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

type Note = {
  time: number
  position: number
  state: NoteState
}

type NoteExplosionAnimation = {
  x: number
  y: number
  time: number
}

function createSprite(textureName: string, x = 0, y = 0) {
  const sprite = new pixi.Sprite(pixi.loader.resources[textureName].texture)
  sprite.position.set(x, y)
  pivotToCenter(sprite)
  return sprite
}

function pivotToCenter(sprite: pixi.Sprite) {
  sprite.pivot.set(sprite.width / 2, sprite.height / 2)
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

function renderNoteSprites(notes: Note[], container: pixi.Container) {
  container.removeChildren()
  for (const note of notes) {
    if (note.state !== NoteState.active) continue
    const pos = getScreenPosition(note)
    container.addChild(createNoteSprite(pos.x, pos.y))
  }
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

function renderReceptors(notes: Note[], songTime: number, container: pixi.Container) {
  container.removeChildren()
  for (const note of notes) {
    const pos = getScreenPosition(note)
    if (pos.y + getTrackOffset(songTime) < receptorPosition && note.state === NoteState.active) {
      const alpha = 1 - Math.abs(songTime - note.time)
      container.addChild(createReceptorSprite(pos.x, receptorPosition, alpha))
    }
  }
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

function renderNoteExplosions(container: pixi.Container, explosions: NoteExplosionAnimation[]) {
  container.removeChildren()
  for (const anim of explosions) {
    const sprite = container.addChild(createExplosionSprite(anim.x, anim.y))
    sprite.y += anim.time ** 2.5 * 80
    sprite.alpha = 1 - anim.time
  }
}

export default class Game {
  notes = [
    { time: 0 / 2, position: 0 / 4, state: NoteState.active },
    { time: 1 / 2, position: 1 / 4, state: NoteState.active },
    { time: 2 / 2, position: 2 / 4, state: NoteState.active },
    { time: 3 / 2, position: 3 / 4, state: NoteState.active },
    { time: 4 / 2, position: 4 / 4, state: NoteState.active },
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
      this.explosions.push({ x: pos.x, y: receptorPosition, time: 0 })
    }
  }

  draw(renderer: pixi.SystemRenderer) {
    renderReceptors(this.notes, this.songTime, this.receptorContainer)
    renderNoteSprites(this.notes, this.noteContainer)
    renderNoteExplosions(this.explosionContainer, this.explosions)
    renderer.render(this.stage)
  }
}
