const {GraphQLNonNull, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {ReproduccionType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
  createReproduccion: {
    type: ReproduccionType,
    description: 'Inserta un nuevo Reproduccion',
    args: {
      alumno_id: {type: GraphQLNonNull(GraphQLInt)},
      archivo_id: {type: GraphQLNonNull(GraphQLInt)},
      tiempo: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, args, {models}) {
      let reproduccion = await models.Reproduccion.getByAlumnoIdArchivoId(args.alumno_id, args.archivo_id)

      if (reproduccion) {
        if (args.tiempo > reproduccion.tiempo) {
          delete reproduccion.updated_at
          reproduccion = await models.Reproduccion.update({
            id: reproduccion.id,
            update: {...reproduccion, tiempo: args.tiempo}
          })
        }
      } else
        reproduccion = await models.Reproduccion.create(args)

      return reproduccion
    }
  }
}