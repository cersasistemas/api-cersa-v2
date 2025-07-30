const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {PromocionType} = require("../type")

module.exports = {
    promociones: {
        type: GraphQLList(PromocionType),
        description: 'Todos las Promociones activas',
        async resolve(parent, args, {models}) {

            return models.Promocion.getAll()
        }
    },
    promocion: {
        type: PromocionType,
        description: 'Promoción por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Promocion.getById(id)
        }
    }
}