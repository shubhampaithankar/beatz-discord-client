const Command = require('@Models/Command')
const {
  Message
} = require('discord.js')

module.exports = class JoinCommand extends Command {

  constructor(...args) {
    super(...args, {
      name: 'Join',
      aliases: ['summon'],
      description: 'Joins a voice channel',
      module: 'Music'
    })
  }

  /**
   * 
   * @param {Message} message 
   */

  async run(message, args) {

    let msg, {
      me
    } = message.guild

    if (!message.channel.permissionsFor(me).has('SEND_MESSAGES') && !message.channel.permissionsFor(me).has('VIEW_CHANNEL')) return

    const {
      channel
    } = message.member.voice
    if (!channel) {
      msg = await message.channel.send('You need to join a voice channel')
      return this.client.utils.deleteMsg(msg, 5)
    }

    //Permissions

    if (!channel.permissionsFor(me).has('VIEW_CHANNEL')) {
      msg = await message.channel.send(`I dont have the required permission to view the channel ${channel.name}: \`VIEW_CHANNEL\``)
      return this.client.utils.deleteMsg(msg, 5)
    }

    if (!channel.permissionsFor(me).has('CONNECT')) {
      msg = await message.channel.send(`I dont have the required permission to join the channel ${channel.name}: \`CONNECT\``)
      return this.client.utils.deleteMsg(msg, 5)
    }

    let player = this.client.utils.getMusicPlayer(message, channel, true)

    if (player.state === 'CONNECTED' || player.voiceChannel !== channel.id) {
      msg = await message.channel.send(`There is a player present in a voice channel`)
      return this.client.utils.deleteMsg(msg, 5)
    }
    player.connect()
  }
}