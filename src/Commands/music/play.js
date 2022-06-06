const Command = require('@Models/Command')
const { Message } = require('discord.js')

module.exports = class PlayCommand extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['p'],
			description: 'Plays music',
			module: 'Music'
		})
	}

	/**
    * 
    * @param {Message} message 
    */

	async run(message, args) {
    
      const { channel } = message.member.voice
      if (!channel) {
        msg = await message.channel.send('You need to join a voice channel')
        return this.client.utils.deleteMsg(msg, 5)
      }

      let player = this.client.utils.getMusicPlayer(message, channel, true)

      if (channel.id !== player.voiceChannel) {
        msg = await message.channel.send('You\'re not in the same voice channel')
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
        res = await player.search(search, message.author)
        if (res.loadType === 'LOAD_FAILED') {
          if (!player.queue.current) player.destroy()
          throw res.exception
        }
      } catch (err) {
        msg = await message.channel.send(`There was an error while searching: \`${err.message}\``)
        return this.client.utils.deleteMsg(msg, 10)
      }

      switch (res.loadType) {

        case 'NO_MATCHES': {
          if (!player.queue.current)  player.destroy()

          msg = await message.channel.send(`No results found for the term: **${search}**`)
          return this.client.utils.deleteMsg(msg, 10)
        }
        case 'TRACK_LOADED': {
          player.queue.add(res.tracks)
          if (!player.playing && !player.paused && !player.queue.size) player.play()
            
          msg = await message.channel.send(`Added \`${res.tracks[0].title}\` to the queue`)
          return this.client.utils.deleteMsg(msg, 10)
        }
        case 'PLAYLIST_LOADED': {
          player.queue.add(res.tracks)

          if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play()
          
          msg = await message.channel.send(`Queued playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks`)
          return this.client.utils.deleteMsg(msg, 10)
        }
        case 'SEARCH_RESULT': {
          let max = 10, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content)
          if (res.tracks.length < max) max = res.tracks.length

          const results = res.tracks
            .slice(0, max)
            .map((track, index) => `\`\`\`javascript\n${++index}. ${this.client.utils.truncateString(track.title)} - ${this.client.utils.convertMstoMinutes(track.duration)}\nType 'cance' to cancel selection\n\`\`\``)
            .join('\n')

          let tracksMsg = await message.channel.send(results)

          try {
            collected = await message.channel.awaitMessages({ filter, max: 1, time: 10e3, errors: ['time'] })
          } catch (error) {
            if (!player.queue.current) player.destroy()
            msg = await message.channel.send(`You did not provide a selection`)
            this.client.utils.deleteMsg(msg, 10)
          }

          this.client.utils.deleteMsg(tracksMsg, 10)

          const first = collected.first().content
          if (first.toLowerCase() === 'end') {
            if (!player.queue.current) player.destroy()
            msg = await message.channel.send('Cancelled selection')
            return this.client.utils.deleteMsg(msg, 10)
          }

          const index = Number(first) - 1
          if (index < 0 || index > max - 1) {
            msg = await message.channel.send(`Provide a number between 1 to 10`)
            return this.client.utils.deleteMsg(msg, 10)
          }

          const track = res.tracks[index]
          player.queue.add(track)

          if (!player.playing && !player.paused && !player.queue.size) player.play()
          msg = await message.channel.send(`Added \`${track.title}\` to the queue`)
          return this.client.utils.deleteMsg(msg, 10)
        }
      }
	  }
	}