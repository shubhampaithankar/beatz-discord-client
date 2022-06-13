const Command = require('@Models/Command')
const { Message } = require('discord.js')

module.exports = class PingCommand extends Command {

	constructor(...args) {
		super(...args, {
			name: 'Ping',
			aliases: ['pong'],
			description: 'This provides the ping of the bot',
			module: 'Utilities'
		})
	}

	/**
    * 
    * @param {Message} message 
    */

	async run(message, args) {
		const msg = await message.channel.send('Pinging...')
		const latency = msg.createdTimestamp - message.createdTimestamp
		const choices = ['Is this really my ping?', 'Is this okay? I can\'t look!', 'I hope it isn\'t bad!']
		const response = choices[Math.floor(Math.random() * choices.length)]

		msg.edit(`${response} - Bot Latency: \`${latency}ms\`, API Latency: \`${Math.round(this.client.ws.ping)}ms\``)
		this.client.utils.deleteMsg(msg, 15)
	}

}