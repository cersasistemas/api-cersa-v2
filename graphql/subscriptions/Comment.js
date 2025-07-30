const {GraphQLNonNull, GraphQLInt} = require("graphql")

const {pubsub, withFilter} = require("../../scripts/pubsub")
const {CommentType} = require("../type")

module.exports = {
  newComment: {
    type: CommentType,
    args: {
      archivo_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    subscribe: withFilter(
      () => pubsub.asyncIterator('newCommentByArchivo'),
      (payload, variables) => {
        console.log(payload.archivo_id, variables.archivo_id)
        return payload.archivo_id === variables.archivo_id
      }
    ),
    resolve: args => args
  }
}