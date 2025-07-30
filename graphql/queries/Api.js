const {GraphQLNonNull, GraphQLString} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")

const {ApiRestType} = require("../type")
const {ApiRest} = require("../../scripts/rest")

module.exports = {
    apirest: {
        type: ApiRestType,
        args: {
            path: {type: GraphQLNonNull(GraphQLString)},
            data: {type: GraphQLNonNull(GraphQLJSON)},
        },
        async resolve(parent, args) {
            return await ApiRest(args)
        }
    },
}