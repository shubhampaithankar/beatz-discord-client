const Event = require('@Models/Event')
const { Guild } = require('discord.js')

const guildDB = require('@Database/Functions/guildDB')

module.exports = class GuildCreateEvent extends Event {

        /**
         * 
         * @param {Guild} guild 
         */

        run = async (guild) => {
                let newGuild = await guildDB(guild, true)
        }
}