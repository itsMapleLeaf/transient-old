// import * as path from 'path'
import {Howl} from 'howler'

declare var require: any

export type SongData = {
  title: string
  artist: string
  art: string
  offset: number
  audio: string[]
  notes: [number, number][]
}

type SongRegistry = {
  [name: string]: SongData
}

const songs = {} as SongRegistry
// const songsFolder = './songs'

// function loadSong(name: string, art: string, audio: string[]) {
//   const data = require(path.join(songsFolder, name, 'song.yaml')) as SongData
//   data.art = require(path.join(songsFolder, name, art))
//   data.audio = audio.map(file => require(path.join(songsFolder, name, file)))
// }

// export function loadSongs() {
//   const context = require.context('../songs', true, /song\.yaml/)
//   for (const file of context.keys() as string[]) {
//     const data = context(file)
//     const name = path.basename(path.dirname(file))

//     const song: SongData = {
//       title: data.title,
//       artist: data.artist,
//       art: path.join('songs', name, data.art),
//       offset: data.offset,
//       audio: data.audio.map((file: string) => path.join('songs', name, file)),
//       notes: data.notes
//     }

//     songs[name] = song
//   }

//   console.log(songs)
// }

export function getSongList() {
  return Object.keys(songs).sort()
}

export function loadSong(name: string) {
  const songData = require(`./assets/songs/${name}/song.js`) as SongData
  return songData
}

export function loadSongAudio(song: SongData) {
  return new Howl({
    src: song.audio
  })
}
