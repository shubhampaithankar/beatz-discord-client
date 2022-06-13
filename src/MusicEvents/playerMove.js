const MusicEvent = require('@Models/MusicEvent')

const { Player } = require('erela.js')

module.exports = class PlayerMoveEvent extends MusicEvent {
  	/**
     * 
     * @param {Player} player 
     */
  async run (player, oldChannel, newChannel) {
    const newchannel = newChannel ? this.client.channels.cache.get(newChannel) : null
    newchannel ? player.setVoiceChannel(newchannel.id) : player.destroy()
  }
}