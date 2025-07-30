const {GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLString} = require("graphql")

const {NotificationType} = require("../type")

module.exports = {
  notifications: {
    type: GraphQLList(NotificationType),
    description: 'Todos las Notifications activas',
    async resolve(parent, args, {models}) {

      return models.Notification.getAll()
    }
  },
  notification: {
    type: NotificationType,
    description: 'Notification por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Notification.getById(id)
    }
  },
  notificationByDeviceId: {
    type: GraphQLList(NotificationType),
    description: 'Notification por id',
    args: {
      device_id: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, {device_id}, {models}) {
      const device = await models.Device.getByDeviceId(device_id)
      const cursos = await models.Curso.getByAlumnoId(device.alumno_id)
      let notificaciones = [], nHcs = []
      for (const curso of cursos) {
        const nHc = await models.NotificationHasCurso.getAllByNotificacionId(curso.id)
        if (nHc.length > 0)
          nHcs = nHcs.concat(nHc)
      }
      let nus = nHcs.uniqueObject('notification_id')

      if (device.alumno_id) {
        const ns = await models.Notification.getAllByType(1)
        const nus2 = ns.uniqueObject('id')
        nus = nus.concat(nus2)
      }

      for (const nu of nus.unique()) {
        const n = await models.Notification.getById(nu)
        notificaciones.push(n)
      }

      return notificaciones
    }
  }
}