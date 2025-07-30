const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {CategoriaType} = require("../type")

module.exports = {
    categorias: {
        type: GraphQLList(CategoriaType),
        description: 'Todos las Categorias activas',
        async resolve(parent, args, {models}) {

            return models.Categoria.getAll()
        }
    },
    categoria: {
        type: CategoriaType,
        description: 'Categoria por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Categoria.getById(id)
        }
    }
}