const Command = require('@Models/Command')
const { Message } = require('discord.js')
const { Queue } = require('erela.js')

module.exports = class RemoveCommand extends Command {

	constructor(...args) {
		super(...args, {
      name: 'Remove',
			description: 'Removes a track from queue',
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
      
      const { queue } = player
      
      if (!args.length || args.length > 1 || args[0] > queue.size || args[0] < 1 || isNaN(Number(args[0]))) {
        msg = await message.channel.send(`You need to enter a number between 1 to ${queue.size + 1}`)
        return this.client.utils.deleteMsg(msg, 5)
      }

      if (queue && queue.size > 1) {
        const track = queue.remove(Number(args[0]) - 1)
        msg = await message.channel.send(`Removed \`${track[0].title}\` from queue`)
        return this.client.utils.deleteMsg(msg, 10)
      }
    }
	}
}