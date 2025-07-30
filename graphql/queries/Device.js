const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {DeviceType} = require("../type")

module.exports = {
  devices: {
    type: GraphQLList(DeviceType),
    description: 'Todos los Devices activos',
    async resolve(parent, args, {models}) {

      return models.Device.getAll()
    }
  },
  device: {
    type: DeviceType,
    description: 'Device por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Device.getById(id)
    }
  }
}