const MusicEvent = require('@Models/MusicEvent')

const { Player, Track } = require('erela.js')

module.exports = class TrackStartEvent extends MusicEvent {
  	/**
     * 
     * @param {Player} player      
     * @param {Track} track
     */
  async run (player, track) {
   const channel = this.client.channels.cache.get(player.textChannel)
   channel.send(`Now playing: \`${track.title}\`, requested by \`${track.requester.tag}\`.`)
  }
}