import * as pixi from 'pixi.js'
import * as WebFontLoader from 'webfontloader'

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
