const MusicEvent = require('@Models/MusicEvent')

const { Player, Track } = require('erela.js')

module.exports = class TrackStartEvent extends MusicEvent {
   /**
    * 
    * @param {Player} player      
    * @param {Track} track
    */
   async run(player, track) {
      
      let playerObject = {
         title: `Now Playing`,
         description: `[${track.title}](${track.uri}) [<@${track.requester}>]`,
         thumbnail: track.thumbnail,
      }
      let embed = this.client.utils.createMessageEmbed(playerObject)

      const channel = this.client.channels.cache.get(player.textChannel)

      channel ? channel.send({ embeds: [embed] }) : null
   }
}