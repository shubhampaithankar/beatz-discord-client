const Command = require('@Models/Command')
const { Message } = require('discord.js')
const { Queue } = require('erela.js')

module.exports = class ShuffleCommand extends Command {

	constructor(...args) {
		super(...args, {
      name: 'Shuffle',
			description: 'Shuffles current queue',
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
      if (!player.queue.current) {
        msg = await message.channel.send("There is no music playing")
        return this.client.utils.deleteMsg(msg, 5)
      }

      const { queue } = player
      if (queue && queue.size > 1) queue.shuffle()
      msg = await message.channel.send(`Shuffled the queue`)
      return this.client.utils.deleteMsg(msg, 10)
    }
	}
}