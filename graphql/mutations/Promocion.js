const {GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLFloat} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require("apollo-server-express")

const {PromocionType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
    createPromocion: {
        type: PromocionType,
        description: 'Inserta un nuevo Promoción',
        args: {
            codigo: {type: GraphQLNonNull(GraphQLString)},
            descuento: {type: GraphQLNonNull(GraphQLFloat)},
            fecha_inicio: {type: GraphQLNonNull(GraphQLString)},
            fecha_fin: {type: GraphQLNonNull(GraphQLString)},
            descripcion: {type: GraphQLString}
        },
        resolve(parent, args, {models}) {

            return models.Promocion.create(args)
        }
    },
    updatePromocion: {
        type: PromocionType,
        description: 'Actualiza una Promoción por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)},
            update: {type: GraphQLNonNull(GraphQLJSON)}
        },
        resolve(parent, args, {models}) {
            const errors = fields(PromocionType.getFields(), args.update)

            if (errors.length > 0)
                throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

            return models.Promocion.update(args)
        }
    },
    deletePromocion: {
        type: PromocionType,
        description: 'Elimina una Promoción por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Promocion.delete(id)
        }
    }
}