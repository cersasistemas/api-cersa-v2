const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {RoleType} = require("../type")

module.exports = {
    roles: {
        type: GraphQLList(RoleType),
        description: 'Todos los Roles activas',
        async resolve(parent, args, {models}) {

            return models.Role.getAll()
        }
    },
    role: {
        type: RoleType,
        description: 'Role por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Role.getById(id)
        }
    }
}