const MusicEvent = require('@Models/MusicEvent')

const { Player, Track } = require('erela.js')

module.exports = class QueueEndEvent extends MusicEvent {
  	/**
     * 
     * @param {Player} player 
     * @param {Track} track
     */
  async run (player, track) {
      setTimeout(() => {
         let p = this.client.music.get(player.guild)
         if (p) {
            !p.queue.current ? p.destroy() : null
         }
      }, 60e3)
   }
}