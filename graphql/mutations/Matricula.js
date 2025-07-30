const {GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLBoolean} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require("apollo-server-express")

const {MatriculaType} = require("../type")
const {fields} = require("../../scripts/utils")
const sendEmail = require("../../scripts/email")
// const MatriculaMysql = require("../modelsMysql/Matricula")  // Comentado - ya no necesario
const {pubsub} = require("../../scripts/pubsub")

module.exports = {
  createMatricula: {
    type: MatriculaType,
    description: 'Inserta una nueva Matricula',
    args: {
      curso_id: {type: GraphQLNonNull(GraphQLInt)},
      alumno_id: {type: GraphQLNonNull(GraphQLInt)},
      pago: {type: GraphQLNonNull(GraphQLFloat)},
      descuento: {type: GraphQLFloat},
      fecha_pago: {type: GraphQLNonNull(GraphQLString)},
      nuevo: {type: GraphQLNonNull(GraphQLBoolean)},
      voucher: {type: GraphQLNonNull(GraphQLString)},
      descripcion: {type: GraphQLNonNull(GraphQLString)},
      estado: {type: GraphQLNonNull(GraphQLBoolean)},
      drive: {type: GraphQLString},
    },
    async resolve(parent, args, {user, models}) {
      const alumno = await models.Alumno.getById(args.alumno_id)
      const curso = await models.Curso.getById(args.curso_id)

      // Validar que alumno y curso existen
      if (!alumno) {
        throw new ApolloError('Alumno no encontrado', 'NOT_FOUND')
      }
      if (!curso) {
        throw new ApolloError('Curso no encontrado', 'NOT_FOUND')
      }

      let matricula = await models.Matricula.getAllByCursoIdAndAlumnoId(args.curso_id, args.alumno_id)

      if (!matricula)
        matricula = await models.Matricula.create(args)

      user.email = 'administracion@cersa.org.pe'
      if (!args.estado) {
        await sendEmail({user, tipo: 'matricula', curso, alumno})

        await pubsub.publish('newPendiente', await models.Matricula.getPendientes())
      } else {
        // Código MySQL original comentado
        // const matriculaMysql = await MatriculaMysql.create({
        //   ...args,
        //   curso_mysql: curso.curso_mysql,
        //   alumno_mysql: alumno.alumno_mysql
        // })
        // matricula = await models.Matricula.update({
        //   id: matricula.id,
        //   update: {matricula_mysql: matriculaMysql.insertId}
        // })

        // Nueva lógica sin MySQL directo - la matrícula ya está confirmada
        matricula = await models.Matricula.update({
          id: matricula.id,
          update: {estado: true}
        })

        alumno.drive = args.drive ? args.drive.toString().trim() : ''
        user.email = alumno.email
        await sendEmail({user, tipo: 'confirmacionMatricula', curso, alumno})
      }

      return matricula
    }
  },
  updateMatricula: {
    type: MatriculaType,
    description: 'Actualiza una Matricula por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
      update: {type: GraphQLNonNull(GraphQLJSON)}
    },
    async resolve(parent, args, {user, models}) {
      const errors = fields(MatriculaType.getFields(), args.update)

      if (errors.length > 0)
        throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

      let matricula = await models.Matricula.getById(args.id)
      
      // Validar que la matrícula existe
      if (!matricula) {
        throw new ApolloError('Matrícula no encontrada', 'NOT_FOUND')
      }

      // Código original comentado
      // if (args.update.estado && matricula.matricula_mysql === null) {
      //   const alumno = await models.Alumno.getById(matricula.alumno_id)
      //   const curso = await models.Curso.getById(matricula.curso_id)
      //   const matriculaMysql = await MatriculaMysql.create({
      //     ...args,
      //     curso_mysql: curso.curso_mysql,
      //     alumno_mysql: alumno.alumno_mysql
      //   })
      //   args.update.matricula_mysql = matriculaMysql.insertId
      //   alumno.drive = args.update.drive.toString().trim()
      //   user.email = alumno.email
      //   await sendEmail({user, tipo: 'confirmacionMatricula', curso, alumno})
      // }

      // Nueva lógica sin MySQL directo
      if (args.update.estado && !matricula.estado) {
        const alumno = await models.Alumno.getById(matricula.alumno_id)
        const curso = await models.Curso.getById(matricula.curso_id)
        
        // Validar que alumno y curso existen
        if (!alumno || !curso) {
          throw new ApolloError('Alumno o Curso no encontrado', 'NOT_FOUND')
        }

        // Actualizar drive del alumno si se proporciona
        if (args.update.drive) {
          alumno.drive = args.update.drive.toString().trim()
          await models.Alumno.update({
            id: alumno.id,
            update: {drive: alumno.drive}
          })
        }

        user.email = alumno.email
        await sendEmail({user, tipo: 'confirmacionMatricula', curso, alumno})
      }

      matricula = await models.Matricula.update(args)
      await pubsub.publish('newPendiente', await models.Matricula.getPendientes())

      return matricula
    }
  },
  updateValoracionCurso: {
    type: MatriculaType,
    description: 'Actualiza una Valoración Matricula',
    args: {
      curso_id: {type: GraphQLNonNull(GraphQLInt)},
      alumno_id: {type: GraphQLNonNull(GraphQLJSON)},
      valoracion_curso: {type: GraphQLNonNull(GraphQLInt)},
      vc_mensaje: {type: GraphQLString}
    },
    async resolve(parent, args, {models}) {
      return models.Matricula.valoracionCurso(args)
    }
  },
  updateValoracionDocente: {
    type: MatriculaType,
    description: 'Actualiza una Valoración Matricula',
    args: {
      curso_id: {type: GraphQLNonNull(GraphQLInt)},
      alumno_id: {type: GraphQLNonNull(GraphQLJSON)},
      valoracion_docente: {type: GraphQLNonNull(GraphQLInt)},
      vd_mensaje: {type: GraphQLString},
    },
    async resolve(parent, args, {models}) {
      return models.Matricula.valoracionDocente(args)
    }
  },
  deleteMatricula: {
    type: MatriculaType,
    description: 'Elimina una Matricula por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {id}, {models}) {
      const matricula = await models.Matricula.getById(id)
      
      // Validar que la matrícula existe
      if (!matricula) {
        throw new ApolloError('Matrícula no encontrada', 'NOT_FOUND')
      }

      // Código MySQL original comentado
      // await MatriculaMysql.delete(matricula.matricula_mysql)

      return models.Matricula.delete(id)
    }
  }
}
