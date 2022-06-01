const { Client, Intents, Collection } = require('discord.js')
const { Manager } = require('erela.js')
const mongodb = require('mongodb')
const Loader = require('./Functions/Loader')

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
        //functions
        this.loader = new Loader(this)

        this.aliases = new Collection()
        this.commands = new Collection()

        this.prefix = '.'

        this.music = new Manager({
            nodes: [
                {
                  host: "localhost",
                  password: "youshallnotpass",
                  port: 2333,
                }
              ],
            send: (id, payload) => {
                const guild = this.client.guilds.cache.get(id);
                // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
                if (guild) guild.shard.send(payload)
            }
        }) 
    }

    initialize = (token) => {
        super.login(token)
        this.loader.init()
    }
}
