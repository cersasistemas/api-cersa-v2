const {GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLBoolean} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')
require('dotenv').config()

const {SesionType} = require("../type")
const {fields} = require("../../scripts/utils")
const {onesignal, onesignalDelete} = require("../../scripts/notification")
const {dateTime30min} = require("../../scripts/utils")

module.exports = {
  createSesion: {
    type: SesionType,
    description: 'Inserta un nueva Session',
    args: {
      curso_id: {type: GraphQLNonNull(GraphQLInt)},
      nombre: {type: GraphQLNonNull(GraphQLString)},
      fecha: {type: GraphQLNonNull(GraphQLString)},
      descripcion: {type: GraphQLString},
      dias: {type: GraphQLNonNull(GraphQLJSON)},
      link: {type: GraphQLNonNull(GraphQLString)},
      password: {type: GraphQLNonNull(GraphQLString)},
      reunion_id: {type: GraphQLNonNull(GraphQLString)},
      recurrente: {type: GraphQLNonNull(GraphQLBoolean)},
      recurrencia: {type: GraphQLString},
      fecha_finalizacion: {type: GraphQLString},
      duracion: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, args, {models}) {
      let session = await models.Sesion.create(args)
      let {nombre_corto} = await models.Curso.getById(args.curso_id)

      let message = {
        app_id: process.env.NOTIFICATION_APP_ID,
      }
      let devices = await models.Device.getAllByCursoId(args.curso_id)
      let player_ids = []
      let response = {}

      for (const device of devices)
        player_ids.push(device.device_id)

      if (args.recurrente) {
        const dias = args.dias ? args.dias : []
        for (const dia of dias) {
          response = {}

          message = {
            ...message,
            contents: {'en': `${args.descripcion}. Curso: ${nombre_corto} Reunión ID: ${args.reunion_id} Password: ${args.password} Fecha: ${dia}`},
            send_after: `${dia} GMT-0500`,
            include_player_ids: player_ids
          }

          if (player_ids.length > 0)
            response = await onesignal(message)

          await models.SesionDias.create({
            sesion_id: session.id,
            fecha: dia,
            onesignal_id: response.id ? response.id : null,
            session: true
          })

          response = {}
          const newNoti30 = dateTime30min(dia)

          message = {
            ...message,
            contents: {'en': `${args.descripcion}. Curso: ${nombre_corto} Reunión ID: ${args.reunion_id} Password: ${args.password} Fecha: ${dia}`},
            send_after: `${newNoti30} GMT-0500`,
          }

          if (player_ids.length > 0)
            response = await onesignal(message)

          await models.SesionDias.create({
            sesion_id: session.id,
            fecha: newNoti30,
            onesignal_id: response.id ? response.id : null
          })
        }
      } else {
        message = {
          ...message,
          contents: {'en': `${args.descripcion}. Curso: ${nombre_corto} Reunión ID: ${args.reunion_id} Password: ${args.password} Fecha: ${args.fecha.replace(/T/g, " ").padEnd(19, ':00')}`},
          send_after: `${args.fecha.replace(/T/g, " ").padEnd(19, ':00')} GMT-0500`,
          include_player_ids: player_ids
        }

        if (player_ids.length > 0)
          response = await onesignal(message)

        models.SesionDias.create({
          sesion_id: session.id,
          fecha: args.fecha,
          onesignal_id: response.id ? response.id : null,
          session: true
        })

        response = {}
        const newNoti30 = dateTime30min(args.fecha.replace(/T/g, ' ').padEnd(19, ':00'))

        message = {
          ...message,
          contents: {'en': `${args.descripcion}. Curso: ${nombre_corto} Reunión ID: ${args.reunion_id} Password: ${args.password} Fecha: ${args.fecha.replace(/T/g, " ").padEnd(19, ':00')}`},
          send_after: `${newNoti30} GMT-0500`
        }

        if (player_ids.length > 0)
          response = await onesignal(message)

        await models.SesionDias.create({
          sesion_id: session.id,
          fecha: newNoti30,
          onesignal_id: response.id ? response.id : null
        })
      }
      return session
    }
  },
  updateSesion: {
    type: SesionType,
    description: 'Actualiza una Session por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
      update: {type: GraphQLNonNull(GraphQLJSON)}
    },
    resolve(parent, args, {models}) {
      const errors = fields(SesionType.getFields(), args.update)

      if (errors.length > 0)
        throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

      return models.Sesion.update(args)
    }
  },
  deleteSesion: {
    type: SesionType,
    description: 'Elimina una Session por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {id}, {models}) {
      const sesionDias = await models.SesionDias.getAll(id)

      for (const notificacion of sesionDias) {
        await onesignalDelete(notificacion.onesignal_id)
        await models.SesionDias.delete(notificacion.id)
      }

      return models.Sesion.delete(id)
    }
  }
}