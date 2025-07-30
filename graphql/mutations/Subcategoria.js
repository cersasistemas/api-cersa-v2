const {GraphQLNonNull, GraphQLString, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {SubcategoriaType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
  createSubcategoria: {
    type: SubcategoriaType,
    description: 'Inserta un nueva Subcategoria',
    args: {
      categoria_id: {type: GraphQLNonNull(GraphQLInt)},
      nombre: {type: GraphQLNonNull(GraphQLString)},
      descripcion: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve(parent, args, {models}) {

      return models.Subcategoria.create(args)
    }
  },
  updateSubcategoria: {
    type: SubcategoriaType,
    description: 'Actualiza una Subcategoria por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
      update: {type: GraphQLNonNull(GraphQLJSON)}
    },
    resolve(parent, args, {models}) {
      const errors = fields(SubcategoriaType.getFields(), args.update)

      if (errors.length > 0)
        throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

      return models.Subcategoria.update(args)
    }
  },
  deleteSubcategoria: {
    type: SubcategoriaType,
    description: 'Elimina una Subcategoria por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Subcategoria.delete(id)
    }
  }
}