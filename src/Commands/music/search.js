const Command = require('@Models/Command')
const {
  Message
} = require('discord.js')

module.exports = class SearchCommand extends Command {

  constructor(...args) {
    super(...args, {
      name: 'Search',
      description: 'Searches music',
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

    if (!args.length) {
      msg = await message.channel.send('Please enter a search term or URL')
      return this.client.utils.deleteMsg(msg, 5)
    }

    if (player.state !== 'CONNECTED') player.connect()

    const search = args.join(' ')
    let res;

    try {
      res = await player.search(search, message.author.id)
      if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy()
        throw res.exception
      }
    } catch (err) {
      msg = await message.channel.send(`There was an error while searching: \`${err.message}\``)
      return this.client.utils.deleteMsg(msg, 5)
    }

    switch (res.loadType) {
      case 'SEARCH_RESULT': {
        let max = 10,
          collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content)
        if (res.tracks.length < max) max = res.tracks.length

        const results = res.tracks
          .slice(0, max)
          .map((track, index) => `${++index}. ${this.client.utils.truncateString(track.title, 50)} - ${this.client.utils.convertMstoMinutes(track.duration)}`)
          .join('\n')


        let searchResults = `\`\`\`javascript\n${results}\nType 'cancel' to cancel to selection\`\`\``

        let tracksMsg = await message.channel.send(searchResults)

        try {
          collected = await message.channel.awaitMessages({
            filter,
            max: 1,
            time: 15e3,
            errors: ['time']
          })
          this.client.utils.deleteMsg(collected.first(), 10)
        } catch (error) {
          if (!player.queue.current) player.destroy()
          msg = await message.channel.send(`You did not provide a selection`)
          return this.client.utils.deleteMsg(msg, 5)
        }

        this.client.utils.deleteMsg(tracksMsg, 10)

        const first = collected.first().content
        if (first.toLowerCase() === 'cancel') {
          if (!player.queue.current) player.destroy()
          msg = await message.channel.send('Cancelled selection')
          return this.client.utils.deleteMsg(msg, 5)
        }

        const index = Number(first) - 1
        if (index < 0 || index > max - 1) {
          msg = await message.channel.send(`Provide a number between 1 to 10`)
          return this.client.utils.deleteMsg(msg, 5)
        }

        const track = res.tracks[index]
        player.queue.add(track)

        if (!player.playing && !player.paused && !player.queue.size) player.play()
        msg = await message.channel.send(`Added \`${track.title}\` to the queue`)
        return this.client.utils.deleteMsg(msg, 5)
      }
    }
  }
}