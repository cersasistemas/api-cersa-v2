const {GraphQLNonNull, GraphQLInt, GraphQLString} = require("graphql")

const {NotificationHasCursoType} = require("../type")

module.exports = {
  createNotificationHasCursos: {
    type: NotificationHasCursoType,
    description: 'Inserta un nueva Notification Has Curso',
    args: {
      notification_id: {type: GraphQLNonNull(GraphQLInt)},
      curso_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, args, {models}) {

      return await models.NotificationHasCurso.create(args)
    }
  },
  deleteNotificationHasCursos: {
    type: NotificationHasCursoType,
    description: 'Elimina una Notification Has Curso por id',
    args: {
      notification_id: {type: GraphQLNonNull(GraphQLInt)},
      curso_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, args, {models}) {

      return models.NotificationHasCurso.delete(args)
    }
  }
}