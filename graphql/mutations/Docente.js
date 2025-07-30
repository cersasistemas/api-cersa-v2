const {GraphQLNonNull, GraphQLString, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {DocenteType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
    createDocente: {
        type: DocenteType,
        description: 'Inserta un nuevo Docente',
        args: {
            dni: {type: GraphQLNonNull(GraphQLString)},
            nombres: {type: GraphQLNonNull(GraphQLString)},
            a_paterno: {type: GraphQLNonNull(GraphQLString)},
            a_materno: {type: GraphQLNonNull(GraphQLString)},
            avatar: {type: GraphQLString},
            descripcion: {type: GraphQLString},
            cv: {type: GraphQLString},
        },
        async resolve(parent, args, {models}) {
            return models.Docente.create(args)
        }
    },
    updateDocente: {
        type: DocenteType,
        description: 'Actualiza un Docente por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)},
            update: {type: GraphQLNonNull(GraphQLJSON)}
        },
        async resolve(parent, args, {models}) {
            const errors = fields(DocenteType.getFields(), args.update)

            if (errors.length > 0)
                throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

            return models.Docente.update(args)
        }
    },
    deleteDocente: {
        type: DocenteType,
        description: 'Elimina un Docente por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Docente.delete(id)
        }
    }
}