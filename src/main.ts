import * as pixi from 'pixi.js'

function animationFrame(): Promise<number> {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve)
  })
}

function loadAssets(): Promise<pixi.loaders.Loader> {
  return new Promise((resolve, reject) => {
    pixi.loader.add('note', require('../assets/images/note.svg'))
    pixi.loader.add('background', require('../assets/images/background.svg'))
    pixi.loader.load(resolve)
  })
}

async function main() {
  await loadAssets()

  const view = document.querySelector('canvas') as HTMLCanvasElement
  const renderer = pixi.autoDetectRenderer(540, 960, { view })
  const stage = new pixi.Container()

  const background = new pixi.Sprite(pixi.loader.resources['background'].texture)
  const note = new pixi.Sprite(pixi.loader.resources['note'].texture)

  note.position.set(100, 100)

  stage.addChild(background)
  stage.addChild(note)

  let time = await animationFrame()

  while (true) {
    const now = await animationFrame()
    const elapsed = (now - time) / 1000
    time = now

    note.y += 300 * elapsed

    renderer.render(stage)
  }
}

main().catch(console.error.bind(console))
