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
      }

      let player = this.client.music.get(message.guild.id)
      if (!player) {
        player = this.client.music.create({
          guild: message.guild.id,
          voiceChannel: channel.id,
          textChannel: message.channel.id,
        })
      }

      if (channel.id !== player.voiceChannel) {
        msg = await message.channel.send('You\'re not in the same voice channel')
      }


      if (!args.length) {
        msg = await message.channel.send('Please enter a search term or URL')
      }

      if (player.state !== 'CONNECTED') player.connect();

      const search = args.join(' ')
      let res;

      try {
        res = await player.search(search, message.author)
        if (res.loadType === 'LOAD_FAILED') {
          if (!player.queue.current) player.destroy()
          throw res.exception
        }
      } catch (err) {
        return message.channel.send(`there was an error while searching: ${err.message}`)
      }

      switch (res.loadType) {
        case 'NO_MATCHES': {
          if (!player.queue.current) player.destroy()
          msg = await message.channel.send('there were no results found.')
        }
        case 'TRACK_LOADED': {
          player.queue.add(res.tracks)

          if (!player.playing && !player.paused && !player.queue.size) player.play()
          msg = await message.channel.send(`enqueuing \`${res.tracks[0].title}\`.`)
        }
        case 'PLAYLIST_LOADED': {
          player.queue.add(res.tracks)

          if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play()
          msg = await message.channel.send(`enqueuing playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks.`)
        }
        case 'SEARCH_RESULT': {
          let max = 10, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content)
          if (res.tracks.length < max) max = res.tracks.length

          const results = res.tracks
            .slice(0, max)
            .map((track, index) => `\`\`\`\n${++index} - ${track.title}\n\`\`\``)
            .join('\n')

          message.channel.send(results)

          try {
            collected = await message.channel.awaitMessages({ filter, max: 1, time: 10e3, errors: ['time'] })
          } catch (error) {
            if (!player.queue.current) player.destroy()
            msg = await message.channel.send("you didn't provide a selection.")
            return
          }

          const first = collected.first().content
          if (first.toLowerCase() === 'end') {
            if (!player.queue.current) player.destroy()
            return message.channel.send('Cancelled selection.')
          }

          const index = Number(first) - 1
          if (index < 0 || index > max - 1) {
            return message.channel.send(`the number you provided too small or too big (1-${max}).`)
          }

          const track = res.tracks[index]
          player.queue.add(track)

          if (!player.playing && !player.paused && !player.queue.size) player.play()
          msg = await message.channel.send(`enqueuing \`${track.title}\`.`)
          return
        }
      }

	  }
	}