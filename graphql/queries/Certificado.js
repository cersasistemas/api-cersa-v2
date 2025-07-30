const {GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLString} = require("graphql")

const {CertificadoType} = require("../type")
const createPdf = require("../../scripts/certificado")

module.exports = {
  certificados: {
    type: GraphQLList(CertificadoType),
    description: 'Todos los Matriculas activos',
    async resolve(parent, args, {models}) {

      return models.Certificado.getAll()
    }
  },
  certificadoById: {
    type: CertificadoType,
    description: 'Todos los Matriculas activos',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {id}, {models}) {

      return models.Certificado.getById(id)
    }
  },
  certificadoByCodigo: {
    type: CertificadoType,
    description: 'Todos los Matriculas activos',
    args: {
      codigo: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, {codigo}, {models}) {

      return models.Certificado.getByCodigo(codigo)
    }
  },
  createPdf: {
    type: CertificadoType,
    description: 'Todos los Matriculas activos',
    args: {
      codigo: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, {codigo}, {models}) {
      const certificado = await models.Certificado.getByCodigo(codigo)

      const file_name = await createPdf(certificado)

      return {
        file_name
      }
    }
  },
}