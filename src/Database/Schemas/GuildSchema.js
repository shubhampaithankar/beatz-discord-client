const { Schema } = require('mongoose')

module.exports = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
    ownerId: {
        type: String,
        required: true,
        unique: false
    },
    available: {
        type: Boolean,
        required: true,
    },
    prefix: {
        type: String,
        required: true,
    },
    isPresent: {
        type: Boolean,
        required: true,
    },
    joinedAt: {
        type: Date,
        required: true,
        unique: true
    },
})