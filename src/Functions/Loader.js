const fs = require('fs')
const path = require('path')

const { MongoClient } = require('mongodb')

const BaseEvent = require('../Models/Event')
const BaseCommand = require('../Models/Command')

module.exports = class Loader {
    constructor(client) {
        this.client = client
    }

    init = async () => {
        await this.loadEvents('../Events')
        await this.loadCommands('../Commands')
        await this.loadMusicEvents('../MusicEvents')
        await this.loadMongo()
    }

    loadCommands = async (dir) => {
        const filePath = path.join(__dirname, dir)
        const files = await fs.readdirSync(filePath)
        files.forEach(async cmdFile => {
            const stat = await fs.lstatSync(path.join(filePath, cmdFile))
            if (stat.isDirectory()) this.loadCommands(path.join(dir, cmdFile))
            if (cmdFile.endsWith('.js')) {
                const { name } = path.parse(cmdFile)
                const Command = require(path.join(filePath, cmdFile))
                if (Command.prototype instanceof BaseCommand) {
                    const command = new Command(this.client, name)
                    this.client.commands.set(command.name, command)
                    if (command.aliases.length) {
                        command.aliases.forEach(alias => {
                            this.client.aliases.set(alias, command.name)
                        })
                    }
                }
            }
        })
    }

    loadEvents = async (dir) => {
        const filePath = path.join(__dirname, dir)
        const files = await fs.readdirSync(filePath)
        files.forEach(async eventFile => {
            const stat = await fs.lstatSync(path.join(filePath, eventFile))
            if (stat.isDirectory()) this.loadEvents(path.join(dir, eventFile))
            if (eventFile.endsWith('.js')) {
                const { name } = path.parse(eventFile)
                const Event = require(path.join(filePath, eventFile))
                if (Event.prototype instanceof BaseEvent) {
                    const event = new Event(this.client, name)
                    event.emitter[event.type](name, (...args) => event.run(...args))
                  }
            }
        })
    }

    loadMusicEvents = async (dir) => {
        const filePath = path.join(__dirname, dir)
        const files = await fs.readdirSync(filePath)
        files.forEach(async musicFile => {
            const stat = await fs.lstatSync(path.join(filePath, musicFile))
            if (stat.isDirectory()) this.loadMusicEvents(path.join(dir, musicFile))
            if (musicFile.endsWith('.js')) {
              const Event = require(path.join(filePath, musicFile))
              if (Event.prototype instanceof BaseEvent) {
                const event = new Event()
                if (this.client.music) {
                    this.client.music.on(event.name, event.run.bind(event, this.client))
                }
              }
            }
        })
    }

    loadMongo = async () => {
        const client = new MongoClient(`mongodb+srv://shubham:${process.env.MONGO_PASSWORD}@cluster0.kdox5j6.mongodb.net/beatz-discord-bot`)
        await client.connect()
        console.log('Successfully connected to server')
        const db = client.db(`beatz-discord-bot`)
        this.client.db = db
    }
}