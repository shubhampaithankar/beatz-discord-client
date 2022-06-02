const BaseEvent = require('@Models/Event');

module.exports = class NodeConnectEvent extends BaseEvent {
  constructor () {
    super('nodeConnect');
  }

  async run (client, node) {
    console.log('New Node Connected');
  }
}