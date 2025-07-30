const {GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLFloat} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {CertificadoType} = require("../type")
const {fields} = require("../../scripts/utils")

module.exports = {
  createCertificado: {
    type: CertificadoType,
    description: 'Inserta un nueva Categoria',
    args: {
      codigo: {type: GraphQLNonNull(GraphQLString)},
      matricula_id: {type: GraphQLNonNull(GraphQLInt)},
      nota: {type: GraphQLNonNull(GraphQLFloat)},
      lado_uno: {type: GraphQLNonNull(GraphQLString)},
      lado_dos: {type: GraphQLNonNull(GraphQLString)},
      tipo: {type: GraphQLNonNull(GraphQLString)},
      taller_dias: {type: GraphQLNonNull(GraphQLString)},
    },
    async resolve(parent, args, {models}) {
      const certificado = await models.Certificado.getLast()

      let correlativo = certificado ? certificado.codigo : 'IC0-ESP'
      correlativo = correlativo.split('-')[0]
      correlativo = correlativo.substring(2)
      correlativo = Number(correlativo) + 1
      args.codigo = `IC${correlativo}-ESP`

      return models.Certificado.create(args)
    }
  },
  updateCertificado: {
    type: CertificadoType,
    description: 'Actualiza una Categoria por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
      update: {type: GraphQLNonNull(GraphQLJSON)}
    },
    resolve(parent, args, {models}) {
      const errors = fields(CertificadoType.getFields(), args.update)

      if (errors.length > 0)
        throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

      return models.Certificado.update(args)
    }
  },
  deleteCertificado: {
    type: CertificadoType,
    description: 'Elimina una Categoria por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Certificado.delete(id)
    }
  }
}