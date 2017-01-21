import * as pixi from 'pixi.js'

import RectangleSprite from './RectangleSprite'
import {noteSize} from '../constants'
import * as util from '../util'

export default class NoteSprite extends pixi.Container {
  outline = this.addChild(new RectangleSprite('fill', 0, 0, noteSize + 8, undefined, 0))
  inner = this.addChild(new RectangleSprite('fill', 0, 0, noteSize - 10))
  outer = this.addChild(new RectangleSprite('line', 0, 0, noteSize))
  rotation = util.radians(45)
}
