const {ApolloError} =require("apollo-server-express")
const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {UserType} = require("../type")

module.exports = {
  users: {
    type: GraphQLList(UserType),
    description: 'Todos los Users activos',
    async resolve(parent, args, {user, models}) {
      // const {permissions} = user
      // console.log(permissions)
      // if (!permissions.includes('metrics:read2'))
      //   return new ApolloError('No tiene los privilegios...', '403', {});

      return models.User.getAll()
    }
  },
  user: {
    type: UserType,
    description: 'User por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.User.getById(id)
    }
  }
}