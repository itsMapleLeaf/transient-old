import {Glow} from '../pixi-utils'
import {noteSize} from '../constants'
import * as pixi from 'pixi.js'
import * as util from '../util'
import RectangleSprite from './RectangleSprite'

export default class NoteExplosionSprite extends pixi.Container {
  body = this.addChild(new RectangleSprite('fill', 0, 0, noteSize))
  glow = this.addChild(new Glow(this.body, 20))
  rotation = util.radians(45)
}
