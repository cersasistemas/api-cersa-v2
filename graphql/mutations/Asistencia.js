const {GraphQLNonNull, GraphQLInt} = require("graphql")
const moment = require("moment")

const {AsistenciaType} = require("../type")

module.exports = {
  createAsistencia: {
    type: AsistenciaType,
    description: 'Inserta un nueva Categoria',
    args: {
      sesion_dia_id: {type: GraphQLNonNull(GraphQLInt)},
      alumno_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, args, {models}) {
      const sesion_dia = await models.SesionDias.getById(args.sesion_dia_id)
      const sesion = await models.Sesion.getById(sesion_dia.sesion_id)

      const detalle = sesion.duracion ? sesion.duracion.toString().split(':') : [0, 0]
      const fecha = moment(sesion_dia.fecha, 'YYYY-MM-DD HH:mm:ss')
      fecha.add({hours: detalle[0], minutes: detalle[1]})

      if (!moment().isBetween(moment(sesion_dia.fecha, 'YYYY-MM-DD HH:mm:ss'), fecha))
        return null

      let asistencia = await models.Asistencia.getBySesionDiaIdAlumnoId(args.sesion_dia_id, args.alumno_id)

      if (!asistencia)
        asistencia = await models.Asistencia.create(args)

      return asistencia
    }
  },
  deleteAsistencia: {
    type: AsistenciaType,
    description: 'Elimina una Categoria por id',
    args: {
      sesion_id: {type: GraphQLNonNull(GraphQLInt)},
      alumno_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {sesion_id, alumno_id}, {models}) {

      return models.Asistencia.delete(sesion_id, alumno_id)
    }
  }
}