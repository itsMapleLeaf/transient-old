import * as pixi from 'pixi.js'

function animationFrame() {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve)
  })
}

function loadAssets(): Promise<pixi.loaders.Loader> {
  return new Promise((resolve, reject) => {
    pixi.loader.add('note', require('../assets/note.svg'))
    pixi.loader.add('background', require('../assets/background.svg'))
    pixi.loader.load(resolve)
  })
}

async function main() {
  await loadAssets()

  const view = document.querySelector('canvas') as HTMLCanvasElement
  const renderer = pixi.autoDetectRenderer(540, 960, { view })
  const stage = new pixi.Container()

  const note = new pixi.Sprite(pixi.loader.resources['note'].texture)
  note.position.set(100, 100)

  const background = new pixi.Sprite(pixi.loader.resources['background'].texture)

  stage.addChild(background)
  stage.addChild(note)

  while (true) {
    await animationFrame()
    renderer.render(stage)
  }
}

main().catch(console.error.bind(console))
