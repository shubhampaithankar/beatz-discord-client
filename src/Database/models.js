const { model } = require('mongoose')

const guildSchema = require('./Schemas/GuildSchema')
const userSchema = require('./Schemas/UserSchema')


const GuildModel = module.exports = model('guilds', guildSchema, 'guilds')
const UserModel = module.exports = model('users', userSchema, 'users')

module.exports = {
    GuildModel,
    UserModel
}