module.exports = class MusicEvent {
    constructor(client, name, options = {}) {
        this.client = client
        this.music = client.music
        this.type = 'on'
        this.name = name 
        this.emitter = (typeof options.emitter === 'string' ? this.music[options.emitter] : options.emitter) || this.music
    }

    async run(...args) {
		throw new Error(`The run method has not been implemented in ${this.name}`)
	}
}