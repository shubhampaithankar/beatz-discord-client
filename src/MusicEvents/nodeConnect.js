const MusicEvent = require('@Models/MusicEvent')

const { Node } = require('erela.js')

module.exports = class NodeConnectEvent extends MusicEvent {
  	/**
     * 
     * @param {Node} node 
     */
  async run (node) {
    console.log(`New node connected for ${this.client.user.tag} at ${node.socket.url}`)
  }
}