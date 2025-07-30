const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {DocenteType} = require("../type")

module.exports = {
    docentes: {
        type: GraphQLList(DocenteType),
        description: 'Todos los Docentes activos',
        async resolve(parent, args, {models}) {

            return models.Docente.getAll()
        }
    },
    docente: {
        type: DocenteType,
        description: 'Docente por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {
            return models.Docente.getById(id)
        }
    }
}