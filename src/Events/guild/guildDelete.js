const Event = require('@Models/Event')
const { Guild } = require('discord.js')

const guildDB = require('@Database/Functions/guildDB')

module.exports = class GuildDeleteEvent extends Event {

    /**
     * 
     * @param {Guild} guild 
     */
    run = async (guild) => {
        await guildDB(guild, false)
    }

}