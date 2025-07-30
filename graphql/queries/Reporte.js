const {GraphQLNonNull, GraphQLString, GraphQLList, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")

const {ReporteType} = require("../type")
const createExcelVentas = require("../../scripts/excel/ventas")
const createExcelMatriculas = require("../../scripts/excel/matriculas")

module.exports = {
  matriculasByFechaUserCurso: {
    type: GraphQLList(ReporteType),
    description: 'User por id',
    args: {
      fecha_inicio: {type: GraphQLNonNull(GraphQLString)},
      fecha_fin: {type: GraphQLNonNull(GraphQLString)},
      fechas_id: {type: GraphQLNonNull(GraphQLString)},
      user_id: {type: GraphQLInt},
      cursos_id: {type: GraphQLJSON}
    },
    async resolve(parent, {fecha_inicio, fecha_fin, fechas_id, user_id, cursos_id}, {models}) {
      let reporte = []

      if (user_id > 0 && cursos_id.length > 0)
        reporte = await models.Reporte.matriculasByFechaUserCurso(fecha_inicio, fecha_fin, user_id, cursos_id, fechas_id)
      else if (user_id > 0)
        reporte = await models.Reporte.matriculasByFechaUser(fecha_inicio, fecha_fin, user_id, fechas_id)
      else if (cursos_id.length > 0)
        reporte = await models.Reporte.matriculasByFechaCurso(fecha_inicio, fecha_fin, cursos_id, fechas_id)
      else
        reporte = await models.Reporte.matriculasByFecha(fecha_inicio, fecha_fin, fechas_id)

      return reporte
    }
  },
  createExcelVentas: {
    type: ReporteType,
    description: 'User por id',
    args: {
      fecha_inicio: {type: GraphQLNonNull(GraphQLString)},
      fecha_fin: {type: GraphQLNonNull(GraphQLString)},
      fechas_id: {type: GraphQLNonNull(GraphQLString)},
      user_id: {type: GraphQLInt},
      cursos_id: {type: GraphQLJSON}
    },
    async resolve(parent, {fecha_inicio, fecha_fin, fechas_id, user_id, cursos_id}, {models}) {
      let reporte = []

      if (user_id > 0 && cursos_id.length > 0)
        reporte = await models.Reporte.matriculasByFechaUserCurso(fecha_inicio, fecha_fin, user_id, cursos_id, fechas_id)
      else if (user_id > 0)
        reporte = await models.Reporte.matriculasByFechaUser(fecha_inicio, fecha_fin, user_id, fechas_id)
      else if (cursos_id.length > 0)
        reporte = await models.Reporte.matriculasByFechaCurso(fecha_inicio, fecha_fin, cursos_id, fechas_id)
      else
        reporte = await models.Reporte.matriculasByFecha(fecha_inicio, fecha_fin, fechas_id)

      return await createExcelVentas(reporte).then(res => res).catch(({message}) => console.log(message))
    }
  },
  createExcelMatriculas: {
    type: ReporteType,
    description: 'User por id',
    args: {
      curso_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {curso_id}, {models}) {
      let matriculas = await models.Matricula.getAllByCursoId(curso_id)
      let curso = await models.Curso.getById(curso_id)

      const reporte = await Promise.all(matriculas.map(async element => {
        element.alumno = await models.Alumno.getById(element.alumno_id)
        return element
      }))

      return await createExcelMatriculas(reporte, curso).then(res => res).catch(({message}) => console.log(message))
    }
  }
}