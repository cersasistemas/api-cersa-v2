const {GraphQLList} = require("graphql")

const {PermissionType} = require("../type")

module.exports = {
    permissions: {
        type: GraphQLList(PermissionType),
        description: 'Todos los Permisos activos',
        async resolve(parent, args, {models}) {

            return models.Permission.getAll()
        }
    }
}