const {GraphQLList} = require("graphql")

const {pubsub} = require("../../scripts/pubsub")
const {MatriculaType} = require("../type")

module.exports = {
  newPendiente: {
    type: GraphQLList(MatriculaType),
    subscribe: () => pubsub.asyncIterator('newPendiente'),
    resolve: async args => args
  }
}