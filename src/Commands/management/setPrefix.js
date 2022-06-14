const Command = require('@Models/Command')
const { Message } = require('discord.js')

const { GuildModel } = require('@Database/models')

module.exports = class SetMusicChannelCommand extends Command {

	constructor(...args) {
		super(...args, {
			name: 'Set Prefix',
			description: 'Sets the custom prefix for this guild',
			module: 'Management'
		})
	}

	/**
    * 
    * @param {Message} message 
    */

	async run(message, args) {
		let msg
		const { id } = message.guild
		const guildCollection = this.client.db.collection('guilds')

		guildCollection.findOneAndUpdate({ id }, {
			prefix
		}, {
			upsert: true,
			new: true
		})
	}

}