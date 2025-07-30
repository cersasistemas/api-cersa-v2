const {PubSub, withFilter} = require('graphql-subscriptions')

class pub {
  constructor() {
    if (pub.instance)
      return pub.instance

    pub.instance = new PubSub()
    pub.instance.ee.setMaxListeners(1000) // raise max listeners in event emitter

    return pub.instance
  }
}

module.exports = {
  pubsub: new pub(),
  withFilter
}