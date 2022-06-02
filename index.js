require('dotenv').config()
require('module-alias/register')

const BeatzClient = require('@src/Client')

const client = new BeatzClient
client.initialize(process.env.DISCORD_TOKEN)