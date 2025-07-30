const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {CursoType} = require("../type")

module.exports = {
  cursos: {
    type: GraphQLList(CursoType),
    description: 'Todos los Cursos activos',
    async resolve(parent, args, {models}) {

      return models.Curso.getAll()
    }
  },
  cursosActivos: {
    type: GraphQLList(CursoType),
    description: 'Todos los Cursos Activos',
    async resolve(parent, args, {models}) {

      return models.Curso.getAllActivos()
    }
  },
  cursosDesactivados: {
    type: GraphQLList(CursoType),
    description: 'Todos los Cursos Desactivados',
    async resolve(parent, args, {models}) {

      return models.Curso.getAllDesactivados()
    }
  },
  curso: {
    type: CursoType,
    description: 'Curso por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Curso.getById(id)
    }
  },
  cursoMysql: {
    type: CursoType,
    description: 'Curso por Mysql Id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Curso.getByMysqlId(id)
    }
  }
}