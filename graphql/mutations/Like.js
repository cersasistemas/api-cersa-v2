const {GraphQLNonNull, GraphQLString, GraphQLInt} = require("graphql")

const {LikeType} = require("../type")

module.exports = {
  createLike: {
    type: LikeType,
    description: 'Inserta un nuevo Like',
    args: {
      comentario_id: {type: GraphQLNonNull(GraphQLInt)},
      persona_id: {type: GraphQLNonNull(GraphQLInt)},
      model: {type: GraphQLNonNull(GraphQLString)},
    },
    async resolve(parent, args, {models}) {

      return  models.Like.create(args)
    }
  }
}