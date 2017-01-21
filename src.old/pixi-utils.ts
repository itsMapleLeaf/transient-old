import * as pixi from 'pixi.js'

export class TypedContainer<T extends pixi.DisplayObject> extends pixi.Container {
  children: T[]
}

export class Glow extends pixi.Container {
  blurFilter: pixi.filters.BlurFilter

  constructor(public subject: pixi.Graphics, radius: number, quality = 10) {
    super()

    this.blurFilter = new pixi.filters.BlurFilter(radius, quality)

    const copy = subject.clone()
    copy.transform = subject.transform
    copy.filters = [this.blurFilter]
    this.addChild(copy)
  }
}
