const { Message } = require("discord.js")

module.exports = class Utils {
    constructor(client) {
        this.client = client
    }

    /**
     * 
     * @param {Message} message 
     * @param {Number} time 
     */
    deleteMessage = (message, time) => {
        return setTimeout(async () => await message.delete(), 1000 * time)
    }
}