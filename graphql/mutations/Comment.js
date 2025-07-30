const {GraphQLNonNull, GraphQLString, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {CommentType} = require("../type")
const {fields} = require("../../scripts/utils")
const {pubsub} = require("../../scripts/pubsub")

module.exports = {
  createComment: {
    type: CommentType,
    description: 'Inserta un nuevo Comment',
    args: {
      persona_id: {type: GraphQLNonNull(GraphQLInt)},
      model: {type: GraphQLNonNull(GraphQLString)},
      comentario_id: {type: GraphQLInt},
      comentario: {type: GraphQLNonNull(GraphQLString)},
      type: {type: GraphQLNonNull(GraphQLString)},
      archivo_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, args, {models}) {
      const comment = await models.Comment.create(args)

      await pubsub.publish('newCommentByArchivo', comment)

      return comment
    }
  },
  updateComment: {
    type: CommentType,
    description: 'Actualiza un Comment por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
      update: {type: GraphQLNonNull(GraphQLJSON)}
    },
    resolve(parent, args, {models}) {
      const errors = fields(CommentType.getFields(), args.update)

      if (errors.length > 0)
        throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

      return models.Comment.update(args)
    }
  },
  deleteComment: {
    type: CommentType,
    description: 'Elimina un Comment por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Comment.delete(id)
    }
  }
}