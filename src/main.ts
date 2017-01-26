import {loadImages, loadFonts, Game} from './game'
import {GameplayState} from './gameplay'

async function main() {
  await loadImages()
  await loadFonts()
  await new Game(new GameplayState()).run()
}

main().catch(err => console.error(err))
