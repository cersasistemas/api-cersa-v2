const {GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLBoolean} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {ArchivoType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
    createArchivo: {
        type: ArchivoType,
        description: 'Inserta un nuevo Archivo',
        args: {
            id: {type: GraphQLInt},
            modulo_id: {type: GraphQLInt},
            nombre: {type: GraphQLString},
            link: {type: GraphQLString},
            tipo: {type: GraphQLString},
            tamanio: {type: GraphQLFloat},
            calidad: {type: GraphQLString},
            duracion: {type: GraphQLFloat},
            html: {type: GraphQLString},
            orden: {type: GraphQLInt}
        },
        async resolve(parent, args, {models}) {

            return models.Archivo.create(args)
        }
    },
    updateArchivo: {
        type: ArchivoType,
        description: 'Actualiza un Archivo por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)},
            update: {type: GraphQLNonNull(GraphQLJSON)}
        },
        resolve(parent, args, {models}) {
            const errors = fields(ArchivoType.getFields(), args.update)

            if (errors.length > 0)
                throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

            return models.Archivo.update(args)
        }
    },
    deleteArchivo: {
        type: ArchivoType,
        description: 'Elimina un Archivo por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Archivo.delete(id)
        }
    }
}