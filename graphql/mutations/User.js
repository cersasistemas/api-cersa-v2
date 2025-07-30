const {GraphQLNonNull, GraphQLString, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {UserType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
  createUser: {
    type: UserType,
    description: 'Inserta un nuevo User',
    args: {
      email: {type: GraphQLNonNull(GraphQLString)},
      nombres: {type: GraphQLNonNull(GraphQLString)},
      a_paterno: {type: GraphQLString},
      a_materno: {type: GraphQLString},
      avatar: {type: GraphQLString},
      password: {type: GraphQLNonNull(GraphQLString)},
      role_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, args, {models}) {

      return models.User.create(args)
    }
  },
  updateUser: {
    type: UserType,
    description: 'Actualiza un User por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
      update: {type: GraphQLNonNull(GraphQLJSON)}
    },
    resolve(parent, args, {models}) {
      const errors = fields(UserType.getFields(), args.update)

      if (errors.length > 0)
        throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

      return models.User.update(args)
    }
  },
  deleteUser: {
    type: UserType,
    description: 'Elimina un User por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.User.delete(id)
    }
  }
}