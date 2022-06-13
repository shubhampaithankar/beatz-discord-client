const MusicEvent = require('@Models/MusicEvent')

const { Player, Track, TrackStuckEvent } = require('erela.js')

module.exports = class TrackStuckEvent extends MusicEvent {
  	/**
     * 
     * @param {Player} player      
     * @param {Track} track
     */
  async run (player, track) {
   // const channel = this.client.channels.cache.get(player.textChannel)
  }
}