const Command = require('@Models/Command')
const { Message } = require('discord.js')

module.exports = class StopCommand extends Command {

	constructor(...args) {
		super(...args, {
      name: 'Stop',
			aliases: ['dc', 'disconnect', 'leave'],
			description: 'Stops music and leaves the voice channel',
			module: 'Music'
		})
	}

	/**
    * 
    * @param {Message} message 
    */

	async run(message, args) {

    let msg
    
    const { channel } = message.member.voice
    if (!channel) {
      msg = await message.channel.send('You need to join the voice channel')
      return this.client.utils.deleteMsg(msg, 5)
    }
    let player = this.client.utils.getMusicPlayer(message, channel)
    if (!player) {
      msg = await message.channel.send(`No player found in any voice channels`)
      return this.client.utils.deleteMsg(msg, 5)
    }
    
    if (player.state === 'CONNECTED') {
      if (player.voiceChannel !== channel.id) {
        msg = await message.channel.send(`You're not in the same voice channel`)
        return this.client.utils.deleteMsg(msg, 5)
      }
      player.destroy()
    }
	}
}