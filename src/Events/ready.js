const Event = require('../Models/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	run() {
        console.log(`Logged in: ${this.client.user.tag}`)
	}

}