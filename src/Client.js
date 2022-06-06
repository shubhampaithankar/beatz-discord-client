const { Client, Intents, Collection } = require('discord.js')

const { Loader, Music, Utils } = require('@Functions/index')

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
        this.utils = new Utils(this)

        this.aliases = new Collection()
        this.commands = new Collection()
    }

    initialize = (token) => {
        super.login(token)
        this.loader.init()
    }
}
