import * as pixi from 'pixi.js'

const viewWidth = 540
const viewHeight = 960

function animationFrame(): Promise<number> {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve)
  })
}

export interface GameState {
  enter(): void
  leave(): void
  update(dt: number): void
  render(renderer: pixi.SystemRenderer): void
  pointerup(event: pixi.interaction.InteractionEvent): void
  pointerdown(event: pixi.interaction.InteractionEvent): void
  pointermove(event: pixi.interaction.InteractionEvent): void
}

export class Game {
  constructor(public state: GameState) {}

  setState(state: GameState) {
    this.state.leave()
    this.state = state
    this.state.enter()
  }

  async run() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    const renderer = pixi.autoDetectRenderer(viewWidth, viewHeight, { view: canvas })
    const interaction = new pixi.interaction.InteractionManager(renderer)

    interaction.on('pointerdown', (event: pixi.interaction.InteractionEvent) => this.state.pointerdown(event))
    interaction.on('pointerup', (event: pixi.interaction.InteractionEvent) => this.state.pointerup(event))
    interaction.on('pointermove', (event: pixi.interaction.InteractionEvent) => this.state.pointermove(event))

    let time = await animationFrame()
    while (true) {
      const now = await animationFrame()
      const dt = (now - time) / 1000
      time = now
      this.state.update(dt)
      this.state.render(renderer)
    }
  }
}
