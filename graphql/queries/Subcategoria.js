const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {SubcategoriaType} = require("../type")

module.exports = {
  subcategorias: {
    type: GraphQLList(SubcategoriaType),
    description: 'Todos las Subcategorias activas por Categoria Id',
    async resolve(parent, args, {models}) {

      return models.Subcategoria.getAll()
    }
  },
  subcategoria: {
    type: SubcategoriaType,
    description: 'Subategoria por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Subcategoria.getById(id)
    }
  },
  subcategoriasByCategoriaId: {
    type: GraphQLList(SubcategoriaType),
    description: 'Subategoria por id',
    args: {
      categoria_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {categoria_id}, {models}) {

      return models.Subcategoria.getAllByCategoriaId(categoria_id)
    }
  }
}