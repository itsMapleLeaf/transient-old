import * as pixi from 'pixi.js'

import {createRect} from './shapes'
import {WorldEvent, SongTimeEvent, TapInputEvent} from './events'
import * as game from './game'
import * as util from './util'

export abstract class Entity {
  abstract sprite: pixi.Container
  alive = true
  update(world: World, dt: number) {}
  handleEvent(world: World, msg: WorldEvent) {}
}

export class World {
  stage = new pixi.Container()
  entities = [] as Entity[]

  add(ent: Entity) {
    this.entities.push(ent)
    this.stage.addChild(ent.sprite)
  }

  update(dt: number) {
    this.entities = this.entities.filter(ent => {
      if (ent.alive) {
        ent.update(this, dt)
      } else {
        this.stage.removeChild(ent.sprite)
      }
      return ent.alive
    })
  }

  send(msg: WorldEvent) {
    this.entities.forEach(ent => ent.handleEvent(this, msg))
  }
}

export class Note extends Entity {
  sprite = new pixi.Container()

  constructor(public time: number, public position: number) {
    super()

    // inner square
    this.sprite.addChild(createRect(0, 0, 40).fill())

    // outer square
    this.sprite.addChild(createRect(0, 0, 50).stroke(1))

    this.sprite.position.x = util.lerp(game.trackMargin, game.viewWidth - game.trackMargin, position)
    this.sprite.position.y = util.lerp(0, game.noteSpacing, time) * -1
    this.sprite.rotation = util.radians(45)
  }
}

export class NoteContainer extends Entity {
  notes = [] as Note[]
  sprite = new pixi.Container()

  addNote(time: number, position: number) {
    const note = new Note(time, position)
    this.notes.push(note)
    this.sprite.addChild(note.sprite)
  }

  handleEvent(world: World, msg: WorldEvent) {
    if (msg instanceof SongTimeEvent) {
      this.sprite.position.y = util.lerp(0, game.noteSpacing, msg.time) + game.receptorPosition
    }
    if (msg instanceof TapInputEvent) {
      for (const note of this.notes) {
        if (Math.abs(note.sprite.position.x - msg.point.x) < 80 && Math.abs(note.time - msg.songTime) < 0.3) {
          world.add(new NoteHitAnimation(note.sprite.position.x, game.receptorPosition))
          note.sprite.alpha = 0
          break
        }
      }
    }
  }
}

export class NoteHitAnimation extends Entity {
  sprite = new pixi.Container()
  rect = createRect(0, 0, 50).fill()
  glow = createRect(0, 0, 50).fill()
  blurFilter = new pixi.filters.BlurFilter(20)
  time = 0

  constructor(x: number, private y: number) {
    super()

    this.glow.filters = [this.blurFilter]

    this.sprite.addChild(this.rect, this.glow)
    this.sprite.position.set(x, y)
    this.sprite.rotation = util.radians(45)
  }

  update(world: World, dt: number) {
    this.time += dt / 0.4
    if (this.time < 1) {
      this.sprite.position.y = this.y + (this.time ** 2) * 80
      this.sprite.alpha = 1 - (this.time ** 2)
      this.blurFilter.blur = Math.max((1 - this.time * 0.5) * 20, 0)
    } else {
      this.alive = false
    }
  }
}
