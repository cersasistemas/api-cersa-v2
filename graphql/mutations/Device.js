const {GraphQLNonNull, GraphQLString, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {DeviceType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
  createDevice: {
    type: DeviceType,
    description: 'Inserta un nuevo Device',
    args: {
      alumno_id: {type: GraphQLInt},
      device_id: {type: GraphQLNonNull(GraphQLString)},
    },
    async resolve(parent, {alumno_id, device_id}, {models}) {
      let device = await models.Device.getByDeviceId(device_id)

      if (!device)
        device = await models.Device.create({alumno_id, device_id})

      return device
    }
  },
  updateDevice: {
    type: DeviceType,
    description: 'Actualiza un Device por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
      update: {type: GraphQLNonNull(GraphQLJSON)}
    },
    resolve(parent, args, {models}) {
      const errors = fields(DeviceType.getFields(), args.update)

      if (errors.length > 0)
        throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

      return models.Device.update(args)
    }
  },
  deleteDevice: {
    type: DeviceType,
    description: 'Elimina un Device por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Device.delete(id)
    }
  }
}