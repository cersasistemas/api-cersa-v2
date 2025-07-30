const {GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLBoolean} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')
require('dotenv').config()

const {NotificationType} = require("../type")
const {fields, timestamp} = require("../../scripts/utils")
const {onesignal, onesignalDelete} = require("../../scripts/notification")

module.exports = {
  createNotification: {
    type: NotificationType,
    description: 'Inserta nueva Notification',
    args: {
      nombre: {type: GraphQLNonNull(GraphQLString)},
      now: {type: GraphQLNonNull(GraphQLBoolean)},
      send_at: {type: GraphQLNonNull(GraphQLString)},
      message: {type: GraphQLNonNull(GraphQLString)},
      tipo: {type: GraphQLNonNull(GraphQLInt)},
      cursos: {type: GraphQLNonNull(GraphQLJSON)}
    },
    async resolve(parent, args, {models}) {
      let player_ids = []

      args.send_at = args.now ? timestamp() : args.send_at
      let notification = await models.Notification.create(args)

      for (const curso of args.cursos)
        await models.NotificationHasCurso.create({notification_id: notification.id, curso_id: curso.value})

      let message = {
        app_id: process.env.NOTIFICATION_APP_ID,
        contents: {'en': notification.message}
      }

      for (const curso of args.cursos) {
        let devices = await models.Device.getAllByCursoId(curso.value)
        player_ids = devices.map(({device_id}) => device_id)
      }

      if (!notification.now)
        message = {
          ...message,
          send_after: `${args.send_at} GMT-0500`,
        }

      if (notification.tipo === 1) {
        message.included_segments = ["All"]
        player_ids.push('All')
      } else
        message.include_player_ids = player_ids// max 2000

      if (player_ids.length > 0) {
        const response = await onesignal(message)

        if (response.id) {
          delete notification.updated_at
          notification = await models.Notification.update({
            id: notification.id,
            update: {...notification, onesignal_id: response.id}
          })
        }
      }

      return notification
    }
  },
  updateNotification: {
    type: NotificationType,
    description: 'Actualiza una Notification por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
      update: {type: GraphQLNonNull(GraphQLJSON)}
    },
    resolve(parent, args, {models}) {
      const errors = fields(NotificationType.getFields(), args.update)

      if (errors.length > 0)
        throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

      return models.Notification.update(args)
    }
  },
  readNotification: {
    type: NotificationType,
    description: 'Read una Notification por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Notification.read(id)
    }
  },
  deleteNotification: {
    type: NotificationType,
    description: 'Elimina una Notification por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {id}, {models}) {
      const notification = await models.Notification.getById(id)

      if (notification.onesignal_id) {
        const response = await onesignalDelete(notification.onesignal_id)
        console.log(response)
      }

      return models.Notification.delete(id)
    }
  },
  sendNotification: {
    type: NotificationType,
    description: 'send Notification',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {id}, {models}) {
      const notification = await models.Notification.getById(id)

      const message = {
        app_id: process.env.NOTIFICATION_APP_ID,
        contents: {'en': notification.message},
        // send_after: '2020-07-18 07:40:00 GMT-0500',
        // included_segments: ["All"]
        // included_segments: ["Active Users"] // Inactive Users
        include_player_ids: ['e5dc3b37-5a45-4919-97d5-d1fc54db15ef'] // max 2000
      }

      const response = await onesignal(message)

      console.log(response)
      return {
        ...response,
        message: response.id
      }
    }
  }
}