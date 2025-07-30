const {GraphQLNonNull, GraphQLString, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {CategoriaType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
    createCategoria: {
        type: CategoriaType,
        description: 'Inserta un nueva Categoria',
        args: {
            nombre: {type: GraphQLNonNull(GraphQLString)},
            descripcion: {type: GraphQLNonNull(GraphQLString)},
            icon: {type: GraphQLString}
        },
        resolve(parent, args, {models}) {

            return models.Categoria.create(args)
        }
    },
    updateCategoria: {
        type: CategoriaType,
        description: 'Actualiza una Categoria por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)},
            update: {type: GraphQLNonNull(GraphQLJSON)}
        },
        resolve(parent, args, {models}) {
            const errors = fields(CategoriaType.getFields(), args.update)

            if (errors.length > 0)
                throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

            return models.Categoria.update(args)
        }
    },
    deleteCategoria: {
        type: CategoriaType,
        description: 'Elimina una Categoria por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Categoria.delete(id)
        }
    }
}