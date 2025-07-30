const {GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLFloat} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {PackType} = require("../type")
const {fields} = require("../../scripts/utils")
const {pubsub} = require("../../scripts/pubsub")

module.exports = {
  createPack: {
    type: PackType,
    description: 'Inserta un nuevo User',
    args: {
      moneda: {type: GraphQLString},
      observaciones: {type: GraphQLString},
      alumno_email: {type: GraphQLNonNull(GraphQLString)},
      detalle: {type: GraphQLNonNull(GraphQLJSON)},
      importe: {type: GraphQLFloat},
      voucher: {type: GraphQLString}
    },
    async resolve(parent, args, {models}) {
      args.alumno_email = args.alumno_email.toLowerCase()
      const pack = await models.Pack.create(args)

      for (const detalle of args.detalle)
        await models.DetallePack.create({...detalle, pack_id: pack.id})

      await pubsub.publish('newPackPendiente', await models.Pack.getPendientes())

      return pack
    }
  },
  updatePack: {
    type: PackType,
    description: 'Actualiza un User por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
      update: {type: GraphQLNonNull(GraphQLJSON)}
    },
    async resolve(parent, args, {models}) {
      const errors = fields(PackType.getFields(), args.update)

      if (errors.length > 0)
        throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

      const pack = await models.Pack.update(args)
      await pubsub.publish('newPackPendiente', await models.Pack.getPendientes())

      return pack
    }
  },
  deletePack: {
    type: PackType,
    description: 'Elimina un User por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {id}, {models}) {
      const pack = await models.Pack.delete(id)
      await pubsub.publish('newPackPendiente', await models.Pack.getPendientes())

      return pack
    }
  }
}