const {GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLString} = require("graphql")

const {MatriculaType} = require("../type")

module.exports = {
  matriculas: {
    type: GraphQLList(MatriculaType),
    description: 'Todos los Matriculas activos',
    async resolve(parent, args, {models}) {

      return models.Matricula.getAll()
    }
  },
  matriculasByCursoId: {
    type: GraphQLList(MatriculaType),
    description: 'Todos los Matriculas activos',
    args: {
      curso_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {curso_id}, {models}) {

      return models.Matricula.getAllByCursoId(curso_id)
    }
  },
  matriculasByAlumnoIdEstado: {
    type: GraphQLList(MatriculaType),
    description: 'Todos los Matriculas Por AlumnoId y Estado',
    args: {
      alumno_id: {type: GraphQLNonNull(GraphQLInt)},
      is_activa: {type: GraphQLBoolean}
    },
    async resolve(parent, {alumno_id, is_activa}, {models}) {
      switch (is_activa) {
        case true:
        case false:
          return models.Matricula.getByAlumnoIdAndEstado(alumno_id, is_activa)
        default:
          return models.Matricula.getAllByAlumnoId(alumno_id)
      }
    }
  },
  matricula: {
    type: MatriculaType,
    description: 'Matricula por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {
      return models.Matricula.getById(id)
    }
  },
  matriculasByCursoIdGroup: {
    type: GraphQLList(MatriculaType),
    description: 'Todos los Matriculas Por AlumnoId y Estado',
    args: {
      curso_id: {type: GraphQLNonNull(GraphQLInt)},
      time: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, {curso_id, time}, {models}) {
      let matriculas = []
      switch (time) {
        case 'day':
          matriculas = await models.Matricula.getAllByCursoIdGroup(curso_id)
          break
        case 'month':
        case 'year':
          matriculas = await models.Matricula.getAllByCursoIdGroupMonthYear(curso_id, time)
          break
      }

      return matriculas
    }
  },
  matriculasByCursoIdGroupImporte: {
    type: GraphQLList(MatriculaType),
    description: 'Todos los Matriculas Por AlumnoId y Estado',
    args: {
      curso_id: {type: GraphQLNonNull(GraphQLInt)},
      time: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, {curso_id, time}, {models}) {
      let matriculas = []
      switch (time) {
        case 'day':
          matriculas = await models.Matricula.getAllByCursoIdGroupImporte(curso_id)
          break
        case 'month':
        case 'year':
          matriculas = await models.Matricula.getAllByCursoIdGroupImporteMonthYear(curso_id, time)
          break
      }

      return matriculas
    }
  },
  matriculasByCursosAlumnos: {
    type: GraphQLList(MatriculaType),
    description: 'Todos los Cursos con Cantidad de Alumnos',
    async resolve(parent, args, {models}) {

      return models.Matricula.getAllAlumnos()
    }
  },
  matriculasByCursosImporte: {
    type: GraphQLList(MatriculaType),
    description: 'Todos los Cursos con Mayor Ingresos',
    async resolve(parent, args, {models}) {

      return models.Matricula.getAllImportes()
    }
  },
  matriculasPendientes: {
    type: GraphQLList(MatriculaType),
    description: 'Todos los Cursos con Mayor Ingresos',
    async resolve(parent, args, {models}) {

      return models.Matricula.getPendientes()
    }
  }
}