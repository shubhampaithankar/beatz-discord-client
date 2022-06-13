const Event = require('@Models/Event')

module.exports = class RawEvent extends Event {
	run(d) {
        if (this.client.music) this.client.music.updateVoiceState(d)
	}
}