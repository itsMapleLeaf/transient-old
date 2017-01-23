import * as path from 'path'
import {Howl} from 'howler'

declare var require: any

type SongData = {
  title: string
  artist: string
  art: string
  offset: number
  audio: string[]
  notes: [number, number][]
  path: string
}

type SongRegistry = {
  [name: string]: SongData
}

const songs = {} as SongRegistry

export function loadSongs() {
  const context = require.context('../songs', true, /song\.yaml/)
  for (const file of context.keys() as string[]) {
    const data = context(file) as SongData
    const folder = path.dirname(file)
    const name = path.basename(folder)
    data.path = path.join('../songs', folder)
    songs[name] = data
  }

  console.log(songs)
}

export function getSongList() {
  return Object.keys(songs).sort()
}

export function getSong(name: string) {
  return songs[name]
}

export function loadSongAudio(song: SongData) {
  return new Howl({
    src: song.audio.map(file => require(path.join(song.path, file)))
  })
}
