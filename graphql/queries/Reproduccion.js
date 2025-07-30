const {GraphQLNonNull, GraphQLInt} = require("graphql")

const {ReproduccionType} = require("../type")

module.exports = {
  reproduccion: {
    type: ReproduccionType,
    description: 'Reproduccion por alumno_id y archivo_id',
    args: {
      alumno_id: {type: GraphQLNonNull(GraphQLInt)},
      archivo_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {alumno_id, archivo_id}, {models}) {

      return models.Reproduccion.getByAlumnoIdArchivoId(alumno_id, archivo_id)
    }
  }
}