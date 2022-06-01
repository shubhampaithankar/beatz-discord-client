const Event = require('../../Models/Event')

module.exports = class extends Event {

	async run(message) {
		if (!message.guild || message.author.bot || !message.content.startsWith(this.client.prefix)) return

		const [cmd, ...args] = message.content.slice(this.client.prefix.length).trim().split(/ +/g)

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()))
		if (command) {
			command.run(message, args)
		}
	}

}