const {GraphQLNonNull, GraphQLInt} = require("graphql")

const {MarcadorType} = require("../type")

module.exports = {
  marcador: {
    type: MarcadorType,
    description: 'Marcador por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Marcador.getById(id)
    }
  }
}