const { Client, Message, Guild, MessageEmbed } = require("discord.js")
const { truncate } = require("lodash")
const moment = require("moment")

module.exports = class Utils {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client
    }

    //DiscordJS functions

    /**
     * 
     * @param {Message} message 
     * @param {Number} time 
     */
    deleteMsg = (message, time) => {
        try { 
            return setTimeout(async () => {
                if (message) {
                    const channel = await this.client.channels.fetch(message.channel.id)
                    if (channel) {
                        const msg = await channel.messages.cache.get(message.id)
                        msg ? await msg.delete() : null
                    }
                }
            }, 1000 * time)
        } catch (error) {
            return
        }
    }
    
    createEmbedMessage = (embedObject) => {
        const { title, url, description, image, fields, thumbnail, footer, timestamp } = embedObject
        
        let embed = new MessageEmbed()
            .setAuthor({ iconURL: this.client.user.avatarURL, name: this.client.user.username })
            .setColor(`#484575`)

        title ? embed.setTitle(title) : null
        title && url ? embed.setURL(url) : null
        description ? embed.setDescription(description) : null
        image ? embed.setImage(image) : null
        thumbnail ? embed.setThumbnail(thumbnail) : null
        footer ? embed.setFooter(footer) : null
        timestamp ? embed.setTimestamp(new Date().toDateString()) : null
        fields.length ? fields.forEach(({ name, value, inline }) => embed.addField(name, value, inline)) : null
    
        return embed
    }

     //Music player functions
    
    /**
     * 
     * @param {Message} guild 
     * @param {Boolean} create 
     */
     getMusicPlayer = (message, voiceChannel, create) => {
        let player = this.client.music.get(message.guild.id)
        if (!player) {
            if (create) {
                player = this.client.music.create({
                    guild: message.guild.id,
                    voiceChannel: voiceChannel.id,
                    textChannel: message.channel.id
                })
            }
        }
        return player
    }

    //Misc Functions 
    convertMstoMinutes = (ms) => {
        return ms && !isNaN(ms) ? moment.duration(ms).asMinutes().toFixed(2) : null
    }

    truncateString = (s, length) => {
        return s ? truncate(s, { length }) : null
    }

}