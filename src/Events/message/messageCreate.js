const Event = require('@Models/Event')
const { Message, Collection } = require('discord.js')

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
			currentGuild = await this.client.utils.guildDB(message.guild, true)
		}

		let { prefix } = currentGuild

		if (message.content.match(mentionRegex)) {
			return message.channel.send(`Prefix for **${message.guild.name}** is \`${prefix}\``)
		}

		if (!message.content.startsWith(prefix)) return

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g)

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()))

		if (command) {

			let msg

			const { cooldowns } = this.client
	
			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Collection())
			}

			const now = Date.now()
			const timestamps = cooldowns.get(command.name)
			const cooldownAmount = command.cooldown * 1000

			if (timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount
				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					msg = await message.channel.send(`Please wait for **${timeLeft.toFixed(1)} second(s) for cooldowns!**`)
					return this.client.utils.deleteMsg(msg, 3)
				}
			}

			switch (command.module) {
				case 'Management': {
					if (!message.member.permissions.has('MANAGE_GUILD')) {
						msg = await message.channel.send(`You dont have permission to use this command: \`MANAGE_GUILD\``)
						return this.client.utils.deleteMsg(msg, 10)
					}
				}
				case 'Music': {
				}				
			}

			command.run(message, args)
			timestamps.set(message.author.id, now)
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

		}
	}
}