const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {CommentType} = require("../type")

module.exports = {
  comments: {
    type: GraphQLList(CommentType),
    description: 'Todos los Comments activos',
    args: {
      archivo_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {archivo_id}, {models}) {

      return models.Comment.getAllArchivoIdDesc(archivo_id)
    }
  },
  commentsMobil: {
    type: GraphQLList(CommentType),
    description: 'Todos los Comments activos',
    args: {
      archivo_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {archivo_id}, {models}) {

      return models.Comment.getAllArchivoIdDesc(archivo_id)
    }
  },
  comment: {
    type: CommentType,
    description: 'Comment por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Comment.getById(id)
    }
  }
}