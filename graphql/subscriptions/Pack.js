const {GraphQLList} = require("graphql")

const {pubsub} = require("../../scripts/pubsub")
const {PackType} = require("../type")

module.exports = {
  newPackPendiente: {
    type: GraphQLList(PackType),
    subscribe: () => pubsub.asyncIterator('newPackPendiente'),
    resolve: async args => args
  }
}