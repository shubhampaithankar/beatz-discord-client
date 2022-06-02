const Event = require('@Models/Event')
const { Message } = require('discord.js')

const { GuildModel } = require('@Database/models')
const guildDB = require('@Database/Functions/guildDB')

module.exports = class MessageCreateEvent extends Event {

	/**
     * 
     * @param {Message} message 
     */

	async run(message) {
		const mentionRegex = RegExp(`<@${this.client.user.id}>`)

		if (!message.guild || message.author.bot) return

		let { prefix } = await GuildModel.findOne({ id: message.guild.id })
		if (!prefix) {
			let createdGuild = await guildDB(message.guild, true)
			prefix = createdGuild.prefix
		}

		if (message.content.match(mentionRegex)) {
			return message.channel.send(`Prefix for **${message.guild.name}** is \`${prefix}\``)
		}

		if (!message.content.startsWith(prefix)) return

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g)

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()))
		if (command) {
			command.run(message, args)
		}
	}

}