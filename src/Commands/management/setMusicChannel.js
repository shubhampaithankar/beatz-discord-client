const Command = require('@Models/Command')
const { Message } = require('discord.js')

const { GuildModel } = require('@Database/models')

module.exports = class SetMusicChannelCommand extends Command {

	constructor(...args) {
		super(...args, {
			name: 'Set Music Channel',
			aliases: ['smc'],
			description: 'Sets the music channel for the bot',
			module: 'Management'
		})
	}

	/**
    * 
    * @param {Message} message 
    */

	async run(message, args) {
		const { id } = message.guild
		const guildModel = await GuildModel.findOneAndUpdate({ id }, {

		}, { upsert: true, new: true })
	}

}