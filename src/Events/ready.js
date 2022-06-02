const Event = require('@Models/Event');

module.exports = class ReadyEvent extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		})
	}

	run() {
        console.log(`Logged in: ${this.client.user.tag}`)
	}

}