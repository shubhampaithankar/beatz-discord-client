const MusicEvent = require('@Models/MusicEvent')

const { Player, Track, TrackEndEvent } = require('erela.js')

module.exports = class TrackEndEvent extends MusicEvent {
  	/**
     * 
     * @param {Player} player      
     * @param {Track} track
     */
  async run (player, track) {
   // const channel = this.client.channels.cache.get(player.textChannel)
   // console.log(`Track has ended: ${track.title}`)
  }
}