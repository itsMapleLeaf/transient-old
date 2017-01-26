import * as pixi from 'pixi.js'
import * as WebFontLoader from 'webfontloader'

const viewWidth = 540
const viewHeight = 960

function animationFrame(): Promise<number> {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve)
  })
}

export class GameState {
  enter() {}
  leave() {}
  update(dt: number) {}
  render(renderer: pixi.SystemRenderer) {}
  pointerup(event: pixi.interaction.InteractionEvent) {}
  pointerdown(event: pixi.interaction.InteractionEvent) {}
  pointermove(event: pixi.interaction.InteractionEvent) {}
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

 export function loadImages() {
   return new Promise<pixi.loaders.Resource>((resolve, reject) => {
     pixi.loader.add('note', require('./assets/images/note.svg'))
     pixi.loader.add('background', require('./assets/images/background.svg'))
     pixi.loader.add('receptor', require('./assets/images/receptor.svg'))
     pixi.loader.add('explosion', require('./assets/images/explosion.svg'))

     pixi.loader.load()
       .on('load', res => console.log(`loading images... (${ res.progress }%)`))
       .on('complete', resolve)
       .on('error', reject)
   })
}

 export function loadFonts() {
   return new Promise<void>((resolve, reject) => {
     WebFontLoader.load({
       google: {
         families: ['Teko']
       },
       fontactive: font => console.log('loaded font', font),
       fontinactive: font => console.error('error loading font ', font),
       active: resolve,
       inactive: reject,
     })
   })
}
