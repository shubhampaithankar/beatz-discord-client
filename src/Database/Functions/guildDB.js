const { Guild } = require('discord.js')

const { GuildModel } = require('@Database/models')

/**
 * 
 * @param {Guild} guild 
 */

module.exports = async (guild, joined) => {
    try {    
        const { id, name, ownerId, available, joinedAt } = guild
        const newGuild = await GuildModel.findOneAndUpdate({ id }, {
            id,
            name,
            ownerId, 
            joinedAt,
            available, 
            prefix: '.',
            isPresent: joined ? true : false
        }, { 
            upsert: true, 
            new: true 
        })
        return newGuild
    } catch (error) {
        console.log(error)
        return null
    }
}