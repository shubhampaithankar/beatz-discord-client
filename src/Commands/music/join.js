const Command = require('@Models/Command')
const { Message } = require('discord.js')

module.exports = class JoinCommand extends Command {

	constructor(...args) {
		super(...args, {
      name: 'Join',
			aliases: ['summon'],
			description: 'Joins a voice channel',
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
      msg = await message.channel.send('You need to join a voice channel')
      return this.client.utils.deleteMsg(msg, 5)
    }

    let player = this.client.utils.getMusicPlayer(message, channel, true)

    if (player.state === 'CONNECTED') {
      if (player.voiceChannel !== channel.id) {
        msg = await message.channel.send(`There is a player present in a voice channel`)
        return this.client.utils.deleteMsg(msg, 5)
      }
    } else player.connect()
	}
}