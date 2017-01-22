import * as pixi from 'pixi.js'

export class Game {
  input = new pixi.interaction.InteractionManager(this.renderer)

  constructor(public renderer: pixi.WebGLRenderer | pixi.CanvasRenderer, public state: GameState) {
    this.input.on('pointerdown', (event: pixi.interaction.InteractionEvent) => this.state.pointerdown(event))
    this.input.on('pointerup', (event: pixi.interaction.InteractionEvent) => this.state.pointerup(event))
    this.input.on('pointermove', (event: pixi.interaction.InteractionEvent) => this.state.pointermove(event))
  }

  update(dt: number) {
    this.state.update(dt)
  }

  render() {
    this.state.render(this.renderer)
  }
}

export abstract class GameState {
  update(dt: number): void {}
  render(renderer: pixi.WebGLRenderer | pixi.CanvasRenderer): void {}
  pointerdown(event: pixi.interaction.InteractionEvent): void {}
  pointerup(event: pixi.interaction.InteractionEvent): void {}
  pointermove(event: pixi.interaction.InteractionEvent): void {}
}
