import {game} from './game'
import {GameplayState} from './gameplay'
import {loadImages, loadFonts} from './resources'

async function main() {
  await loadImages()
  await loadFonts()

  game.setState(new GameplayState())
  await game.run()
}

main().catch(err => console.error(err))
