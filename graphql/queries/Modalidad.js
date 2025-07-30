const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {ModalidadType} = require("../type")

module.exports = {
    modalidades: {
        type: GraphQLList(ModalidadType),
        description: 'Todos las Modalidades activas',
        async resolve(parent, args, {models}) {

            return models.Modalidad.getAll()
        }
    },
    modalidad: {
        type: ModalidadType,
        description: 'Modalidad por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Modalidad.getById(id)
        }
    }
}