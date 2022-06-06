const Event = require('@Models/Event')
const { Message } = require('discord.js')

const guildDB = require('@Database/Functions/guildDB')

module.exports = class MessageCreateEvent extends Event {

	/**
     * 
     * @param {Message} message 
     */

	async run(message) {
		const mentionRegex = RegExp(`<@${this.client.user.id}>`)

		if (!message.guild || message.author.bot) return

		let currentGuild = await this.client.db.collection('guilds').findOne({ id: message.guild.id })
		if (!currentGuild) {
			currentGuild = await guildDB(message.guild, true)
		}

		let { prefix } = currentGuild

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