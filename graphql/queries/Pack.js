const {GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql")

const {PackType} = require("../type")
const MatriculaMysql = require("../modelsMysql/Matricula")
const sendEmail = require("../../scripts/email")
const {pubsub} = require("../../scripts/pubsub")

module.exports = {
  packs: {
    type: GraphQLList(PackType),
    description: 'Todos los Users activos',
    async resolve(parent, args, {models}) {

      return models.Pack.getAll()
    }
  },
  pack: {
    type: PackType,
    description: 'User por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {

      return models.Pack.getById(id)
    }
  },
  packMatricular: {
    type: PackType,
    description: 'User por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {id}, {user, models}) {
      let pack = await models.Pack.getById(id)
      const alumno = await models.Alumno.getByEmail(pack.alumno_email)

      if (!alumno)
        return {
          ...pack,
          id: null
        }

      const detallePack = await models.DetallePack.getAllByPackId(id)
      for (const detalle of detallePack) {
        let matricula = await models.Matricula.getAllByCursoIdAndAlumnoId(detalle.curso_id, alumno.id)

        if (!matricula) {
          const curso = await models.Curso.getById(detalle.curso_id)

          const matriculaMysql = await MatriculaMysql.create({
            ...detalle,
            curso_mysql: curso.curso_mysql,
            alumno_mysql: alumno.alumno_mysql
          })

          matricula = await models.Matricula.create({
            curso_id: curso.id,
            alumno_id: alumno.id,
            pago: detalle.precio,
            descuento: detalle.descuento,
            fecha_pago: pack.fecha_emision,
            nuevo: true,
            matricula_mysql: matriculaMysql.insertId,
            drive: 'https://cersa.org.pe/aulavirtual'
          })

          alumno.drive = 'https://cersa.org.pe/aulavirtual'
          user.email = alumno.email
          await sendEmail({user, tipo: 'confirmacionMatricula', curso, alumno})
        }
      }

      pack = await models.Pack.update({id, update: {estado: true}})
      await pubsub.publish('newPackPendiente', await models.Pack.getPendientes())

      return pack
    }
  },
  packsPendientes: {
    type: GraphQLList(PackType),
    description: 'Todos los Cursos con Mayor Ingresos',
    async resolve(parent, args, {models}) {

      return models.Pack.getPendientes()
    }
  }
}