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

interface Note {
  time: number
  position: number
  state: NoteState
}

interface Animation {
  time: number
}

interface NoteExplosion extends Animation {
  x: number
  y: number
}

function createNote(time: number, position: number): Note {
  return { time, position, state: NoteState.active }
}

function createNoteExplosion(x: number, y: number): NoteExplosion {
  return { x, y, time: 0 }
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

function setSpritePosition(x: number, y: number, sprite: pixi.DisplayObject) {
  sprite.position.set(x, y)
}

function updateAnimation(dt: number, anim: Animation) {
  anim.time += dt
}

function isAnimationExpired(anim: Animation) {
  return anim.time > 1
}

function apply<T>(action: (item: T) => any, items: T[]) {
  items.forEach(action)
}

function sweep<T>(clause: (item: T) => boolean, items: T[]) {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i]
    if (clause(item)) {
      items.splice(i, 1)
    }
  }
}

function renderReceptor(songTime: number, note: Note) {
  const pos = getScreenPosition(note)
  if (pos.y + getTrackOffset(songTime) < receptorPosition && note.state === NoteState.active) {
    const alpha = 1 - Math.abs(songTime - note.time)
    return createReceptorSprite(pos.x, receptorPosition, alpha)
  }
  return null
}

function renderNote(note: Note) {
  if (note.state === NoteState.active) {
    const pos = getScreenPosition(note)
    return createNoteSprite(pos.x, pos.y)
  }
  return null
}

function renderNoteExplosion(anim: NoteExplosion) {
  const sprite = createExplosionSprite(anim.x, anim.y)
  sprite.y += anim.time ** 2.5 * 80
  sprite.alpha = 1 - anim.time
  return sprite
}

function renderCollection<T>(items: T[], renderer: (item: T) => pixi.DisplayObject | null, subject: pixi.Container) {
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
    createNote(0 / 2, 0 / 4),
    createNote(1 / 2, 1 / 4),
    createNote(2 / 2, 2 / 4),
    createNote(3 / 2, 3 / 4),
    createNote(4 / 2, 4 / 4),
  ]

  explosions = [] as NoteExplosion[]

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

    setSpritePosition(0, getTrackOffset(this.songTime), this.noteContainer)

    apply(anim => updateAnimation(dt * 3, anim), this.explosions)
    sweep(isAnimationExpired, this.explosions)
  }

  pointerdown(event: pixi.interaction.InteractionEvent) {
    const note = tryTapNote(this.notes, this.songTime, event.data.global)
    if (note) {
      const pos = getScreenPosition(note)
      this.explosions.push(createNoteExplosion(pos.x, receptorPosition))
    }
  }

  draw(renderer: pixi.SystemRenderer) {
    renderCollection(this.notes, renderNote, this.noteContainer)
    renderCollection(this.explosions, renderNoteExplosion, this.explosionContainer)
    renderCollection(this.notes, rec => renderReceptor(this.songTime, rec), this.receptorContainer)
    renderer.render(this.stage)
  }
}
