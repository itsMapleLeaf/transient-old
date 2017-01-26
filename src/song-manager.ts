// import * as path from 'path'
import {Howl} from 'howler'

declare var require: any

export type NoteData = {
  time: number
  position: number
}

export class Song {
  title: string
  artist: string
  art: string
  offset: number
  audio: string[]
  notes: NoteData[]

  constructor(public name: string) {
    const data = require(`./assets/songs/${name}/song.js`)
    this.title = data.title || ''
    this.artist = data.artist || ''
    this.art = data.art || ''
    this.offset = data.offset || ''
    this.audio = data.audio || []
    this.notes = data.notes.map(([time, position]: [number, number]) => ({ time, position }))
  }

  loadAudio() {
    return new Howl({
      src: this.audio
    })
  }
}
