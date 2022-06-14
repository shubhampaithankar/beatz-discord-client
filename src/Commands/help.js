const Command = require('@Models/Command')
const { Message } = require('discord.js')

module.exports = class HelpCommand extends Command {

	constructor(...args) {
		super(...args, {
			name: 'Help',
			aliases: ['h'],
			description: 'This provides the usage of the bot',
			module: 'Utilities'
		})
	}

	/**
    * 
    * @param {Message} message 
    */

	async run(message, args) {
        const commands = this.client.commands
        const modules = this.client.utils.removeDupes(this.client.commands.map(c => c.module))
		console.log(modules)
	}

}