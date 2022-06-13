const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const { Manager } = require('erela.js')
const Spotify = require('better-erela.js-spotify').default

const BaseEvent = require('@Models/Event')
const BaseMusicEvent = require('@Models/MusicEvent')
const BaseCommand = require('@Models/Command')

module.exports = class Loader {
    constructor(client) {
        this.client = client
    }

    init = async () => {
        await this.loadMongo()
        await this.loadErela()
        await this.loadEvents('../Events')
        await this.loadCommands('../Commands')
        await this.loadMusicEvents('../MusicEvents')
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
                    this.client.commands.set(command.name.toLowerCase(), command)
                    if (command.aliases.length) {
                        command.aliases.forEach(alias => {
                            this.client.aliases.set(alias, command.name.toLowerCase())
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
            const { name } = path.parse(musicFile)
            const Event = require(path.join(filePath, musicFile))
              if (Event.prototype instanceof BaseMusicEvent) {
                const event = new Event(this.client, name)
                event.emitter[event.type](name, (...args) => event.run(...args))
              }
            }
        })
    }

    loadErela = async () => {
        this.client.music = new Manager({
            nodes: [
                {
                  host: 'localhost',
                  password: 'youshallnotpass',
                  port: 2333,
                }
              ],
            plugins: [
                new Spotify(),
            ],
            send: (id, payload) => {
                const guild = this.client.guilds.cache.get(id)
                if (guild) guild.shard.send(payload)
            }
        }) 
    }

    loadMongo = async () => {
        const URI = `mongodb+srv://shubham:${process.env.MONGO_PASSWORD}@cluster0.kdox5j6.mongodb.net/${process.env.DATABASE_NAME}`
        const mongooseClient = await mongoose.connect(URI)
        mongooseClient ? (
            this.client.db = mongooseClient.connection.db,
            console.log(`Successfully connected to database: ${this.client.db.namespace}`)
        ): null
    }
}