import {noteSize} from '../constants'
import * as pixi from 'pixi.js'
import * as util from '../util'
import RectangleSprite from './RectangleSprite'

export default class NoteReceptorSprite extends pixi.Container {
  body = this.addChild(new RectangleSprite('line', 0, 0, noteSize, undefined, undefined, undefined, 2))
  rotation = util.radians(45)
}
