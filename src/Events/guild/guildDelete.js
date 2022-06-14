const Event = require('@Models/Event')
const { Guild } = require('discord.js')

module.exports = class GuildDeleteEvent extends Event {

    /**
     * 
     * @param {Guild} guild 
     */
    run = async (guild) => {
        await await this.client.utils.guildDB(guild, false)
    }

}