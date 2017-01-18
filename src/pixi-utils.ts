import * as pixi from 'pixi.js'

export class TypedContainer<T extends pixi.DisplayObject> extends pixi.Container {
  children: T[]
}
