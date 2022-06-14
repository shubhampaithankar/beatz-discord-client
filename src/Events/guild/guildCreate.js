const Event = require('@Models/Event')
const { Guild } = require('discord.js')

module.exports = class GuildCreateEvent extends Event {

        /**
         * 
         * @param {Guild} guild 
         */

        run = async (guild) => {
                let newGuild = await this.client.utils.guildDB(guild, true)
        }
}