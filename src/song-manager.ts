// import * as path from 'path'
import {Howl} from 'howler'

declare var require: any

export type SongData = {
  title: string
  artist: string
  art: string
  offset: number
  audio: string[]
  notes: NoteData[]
}

export type NoteData = {
  time: number
  position: number
}

export function loadSong(name: string): SongData {
  const data = require(`./assets/songs/${name}/song.js`)
  // TODO: more sanity checks
  return {
    title: data.title || '',
    artist: data.artist || '',
    art: data.art || '',
    offset: data.offset || '',
    audio: data.audio || [],
    notes: data.notes.map(([time, position]: [number, number]) => ({time, position}))
  }
}

export function loadSongAudio(song: SongData) {
  return new Howl({
    src: song.audio
  })
}
