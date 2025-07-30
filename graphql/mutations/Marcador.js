const {GraphQLNonNull, GraphQLString, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {MarcadorType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
  createMarcador: {
    type: MarcadorType,
    description: 'Inserta un nuevo Marcador',
    args: {
      alumno_id: {type: GraphQLNonNull(GraphQLInt)},
      archivo_id: {type: GraphQLNonNull(GraphQLInt)},
      marker: {type: GraphQLString},
      time: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, args, {models}) {

      return  models.Marcador.create(args)
    }
  },
  updateMarcador: {
    type: MarcadorType,
    description: 'Actualiza un Marcador por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
      update: {type: GraphQLNonNull(GraphQLJSON)}
    },
    resolve(parent, args, {models}) {
      const errors = fields(MarcadorType.getFields(), args.update)

      if (errors.length > 0)
        throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

      return models.Marcador.update(args)
    }
  },
  deleteMarcador: {
    type: MarcadorType,
    description: 'Elimina un Marcador por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Marcador.delete(id)
    }
  }
}