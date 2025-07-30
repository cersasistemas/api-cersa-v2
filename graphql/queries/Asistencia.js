const {GraphQLNonNull, GraphQLInt} = require("graphql")

const {AsistenciaType} = require("../type")

module.exports = {
  asistencia: {
    type: AsistenciaType,
    description: 'Categoria por id',
    args: {
      sesion_dia_id: {type: GraphQLNonNull(GraphQLInt)},
      alumno_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {sesion_dia_id, alumno_id}, {models}) {

      return models.Asistencia.getBySesionDiaIdAlumnoId(sesion_dia_id, alumno_id)
    }
  }
}