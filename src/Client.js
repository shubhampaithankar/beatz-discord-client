const { Client, Intents, Collection } = require('discord.js')

const fs = require('fs')
const path = require('path')

const clientOptions = {
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
}

module.exports = class BeatzClient extends Client {
    constructor() {
        super(clientOptions)
        this.aliases = new Collection()
        this.commands = new Collection()
        this.events = new Collection()
        this.modules = new Collection()
    }

    loadEvents = async (dir) => {
        const filePath = path.join(__dirname, dir)
        const files = await fs.readdirSync(filePath)
        files.forEach(async eventFile => {
            const stat = await fs.lstatSync(path.join(filePath, eventFile))
            if (stat.isDirectory()) registerEvents(path.join(dir, eventFile))
            if (eventFile.endsWith('.js')) {
                const { name } = path.parse(eventFile)
                const Event = require(path.join(filePath, eventFile))
                const event = new Event(this, name)
                this.events.set(event.name, event)
                event.emitter[event.type](name, (...args) => event.run(...args))
            }
        })
    }

    initialize = (token) => {
        super.login(token)
        this.loadEvents('/Events')
    }
}
