const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {SesionType} = require("../type")

module.exports = {
    sesiones: {
        type: GraphQLList(SesionType),
        description: 'Todos los Modulos activas',
        args: {
            curso_id: {type: GraphQLNonNull(GraphQLInt)}
        },
        async resolve(parent, {curso_id}, {models}) {

            return models.Sesion.getAll(curso_id)
        }
    },
    sesion: {
        type: SesionType,
        description: 'Modulo por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Sesion.getById(id)
        }
    }
}