const {GraphQLNonNull, GraphQLString, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {RoleType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
    createRole: {
        type: RoleType,
        description: 'Inserta un nuevo Role',
        args: {
            nombre: {type: GraphQLNonNull(GraphQLString)},
            permissions: {type: GraphQLNonNull(GraphQLJSON)},
        },
        async resolve(parent, {nombre, permissions}, {models}) {
            const role = await models.Role.create({nombre})

            permissions.forEach(({id})=>{
                models.RoleHasPermission.create({permission_id: id, role_id: role.id})
            })

            return role
        }
    },
    updateRole: {
        type: RoleType,
        description: 'Actualiza un Role por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)},
            update: {type: GraphQLNonNull(GraphQLJSON)}
        },
        resolve(parent, args, {models}) {
            models.RoleHasPermission.delete(args.id)
            const {permissions} = args.update
            permissions.forEach(({id}) => {
                models.RoleHasPermission.create({permission_id: id, role_id: args.id})
            })
            delete args.update.permissions
            const errors = fields(RoleType.getFields(), args.update)

            if (errors.length > 0)
                throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

            return models.Role.update(args)
        }
    },
    deleteRole: {
        type: RoleType,
        description: 'Elimina un Role por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Role.delete(id)
        }
    }
}