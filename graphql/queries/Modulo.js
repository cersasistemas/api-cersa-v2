const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {ModuloType} = require("../type")

module.exports = {
    modulos: {
        type: GraphQLList(ModuloType),
        description: 'Todos los Modulos activas',
        async resolve(parent, args, {models}) {

            return models.Modulo.getAll()
        }
    },
    modulosByCursoId: {
        type: GraphQLList(ModuloType),
        description: 'Todos los Modulos activas por id del Curso',
        args: {
            curso_id: {type: GraphQLNonNull(GraphQLInt)}
        },
        async resolve(parent, {curso_id}, {models}) {

            return models.Modulo.getAllByCursoId(curso_id)
        }
    },
    modulo: {
        type: ModuloType,
        description: 'Modulo por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Modulo.getById(id)
        }
    }
}