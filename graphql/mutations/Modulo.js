const {GraphQLNonNull, GraphQLString, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {ModuloType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
    createModulo: {
        type: ModuloType,
        description: 'Inserta un nuevo Modulo',
        args: {
            curso_id: {type: GraphQLNonNull(GraphQLInt)},
            nombre: {type: GraphQLNonNull(GraphQLString)}
        },
        resolve(parent, args, {models}) {

            return models.Modulo.create(args)
        }
    },
    updateModulo: {
        type: ModuloType,
        description: 'Actualiza un Modulo por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)},
            update: {type: GraphQLNonNull(GraphQLJSON)}
        },
        resolve(parent, args, {models}) {
            const errors = fields(ModuloType.getFields(), args.update)

            if (errors.length > 0)
                throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

            return models.Modulo.update(args)
        }
    },
    deleteModulo: {
        type: ModuloType,
        description: 'Elimina un Modulo por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Modulo.delete(id)
        }
    }
}