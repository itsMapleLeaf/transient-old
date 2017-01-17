import {Point} from 'pixi.js'
import {World} from './entities'

export abstract class WorldEvent {}

export class SongTimeEvent extends WorldEvent {
  constructor(public time: number) {
    super()
  }
}

export class TapInputEvent extends WorldEvent {
  constructor(public point: Point, public songTime: number, public world: World) {
    super()
  }
}
