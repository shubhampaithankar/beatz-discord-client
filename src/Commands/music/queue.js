const Command = require('@Models/Command')
const {
  Message, MessageEmbed
} = require('discord.js')
const {
  Queue
} = require('erela.js')

module.exports = class Queueommand extends Command {

  constructor(...args) {
    super(...args, {
      name: 'Queue',
      aliases: ['q'],
      description: 'Shuffles current queue',
      module: 'Music'
    })
  }

  /**
   * 
   * @param {Message} message 
   */

  async run(message, args) {

    let msg

    let player = this.client.utils.getMusicPlayer(message)
    if (!player) {
      msg = await message.channel.send(`No player found in any voice channels`)
      return this.client.utils.deleteMsg(msg, 5)
    }

    if (player.state === 'CONNECTED') {
      if (!player.queue.current) {
        msg = await message.channel.send("There is no music playing")
        return this.client.utils.deleteMsg(msg, 5)
      }

      const { queue } = player
      if (queue.size > 1) {

        let { current, previous, ...tracks } = queue, currentPage = 0
        let pages = generateQueuePages(this.client, tracks)

        // const reactions = ['⬅️', '➡️', '🔁', '🔀', '❌']
        const reactions = ['⬅️', '➡️', '❌']

        msg = await message.channel.send(pages[currentPage])

        reactions.forEach(async reaction => await msg.react(reaction))

        const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && (message.author.id === user.id)

        try {
          const collector = msg.createReactionCollector({ filter, time: 60e3, idle: 60e3 })
          collector.on('collect', async (reaction, user) => {
            if (reaction.emoji.name === '➡️') {
              if (currentPage < pages.length) {
                currentPage++
                await msg.edit(pages[currentPage])
              }
            } else if (reaction.emoji.name === '⬅️') {
              if (currentPage !== pages.length) {
                --currentPage
                await msg.edit(pages[currentPage])
              }
            } else if (reaction.emoji.name === '❌') {
              collector.stop()
            }
          })

          collector.on('end', async collected => {
            let newMsg
            const manualStop = !!collected.find(c => c.emoji.name === '❌')
            if (manualStop) {
              await msg.edit(`Stopped queue command`)
              this.client.utils.deleteMsg(msg, 5)
            } else {
              this.client.utils.deleteMsg(msg, 0)
              newMsg = await message.channel.send(`The duration for queue command has ended: **60 Seconds**, please re-enter queue command`)
              this.client.utils.deleteMsg(newMsg, 10)
            }
            return
          })
        } catch (error) {
          
        }
      }
    }
  }
}

function generateQueuePages(client, tracks) {

  let j, k = 10, t = Object.values(tracks), pages = []
  for (let index = 0; index < t.length; index += 10) {
    const current = t.slice(index, k)
    j = index
    k += 10
    const info = current.map(track => `${++j}. ${client.utils.truncateString(track.title, 50)} - ${client.utils.convertMstoMinutes(track.duration)}`).join('\n')
    const page = `\`\`\`javascript\n${info}\`\`\``
    pages.push(page)
  }

  return pages
}