import {NoteData} from './song-manager'
import * as gameplay from './gameplay'
import * as pixi from 'pixi.js'
import * as resources from './resources'
import * as util from './util'

export const enum NoteState {
  active,
  hit,
  missed,
  holding,
}

export class NoteSprite extends pixi.Sprite {
  time = 0
  state = NoteState.active

  constructor(data: NoteData) {
    super(resources.getTexture('note'))
    this.position.x = util.lerp(110, gameplay.viewWidth - 110, data.position)
    this.position.y = gameplay.receptorPosition + data.time * -gameplay.noteSpacing
    this.pivot.set(this.width / 2, this.height / 2)
    this.time = data.time
  }
}
