const MusicEvent = require('@Models/MusicEvent')

const { Player, Track, TrackExceptionEvent } = require('erela.js')

module.exports = class TrackErrorEvent extends MusicEvent {
  	/**
     * 
     * @param {Player} player      
     * @param {Track} track
     */
  async run (player, track) {
   // const channel = this.client.channels.cache.get(player.textChannel)
  }
}