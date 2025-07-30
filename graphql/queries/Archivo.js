const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {ArchivoType} = require("../type")

module.exports = {
  archivos: {
    type: GraphQLList(ArchivoType),
    description: 'Todos los Archivos activos',
    async resolve(parent, args, {models}) {

      return models.Archivo.getAll()
    }
  },
  archivosByModuloId: {
    type: GraphQLList(ArchivoType),
    description: 'Todos los Archivos activos por Sesion id',
    args: {
      modulo_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {modulo_id}, {models}) {

      return models.Archivo.getAllByModuloId(modulo_id)
    }
  },
  archivosByCursoId: {
    type: GraphQLList(ArchivoType),
    description: 'Todos los Archivos activos por Sesion id',
    args: {
      curso_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {curso_id}, {models}) {

      return models.Archivo.getAllByCursoId(curso_id)
    }
  },
  archivo: {
    type: ArchivoType,
    description: 'Archivo por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Archivo.getById(id)
    }
  }
}