const {GraphQLNonNull, GraphQLInt} = require("graphql")
require('dotenv').config()

const {SesionDiasType} = require("../type")
const {onesignalDelete} = require("../../scripts/notification")

module.exports = {
  deleteSesionDia: {
    type: SesionDiasType,
    description: 'Elimina una Sesion Dias por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {id}, {models}) {
      const {onesignal_id} = await models.SesionDias.getById(id)

      await onesignalDelete(onesignal_id)

      return models.SesionDias.delete(id)
    }
  }
}