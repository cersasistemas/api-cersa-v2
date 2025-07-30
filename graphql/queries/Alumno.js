const {GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLString} = require("graphql")

const {AlumnoType} = require("../type")

module.exports = {
  alumnos: {
    type: GraphQLList(AlumnoType),
    description: 'Todos los Alumnos activos',
    async resolve(parent, args, {models}) {

      return models.Alumno.getAll()
    }
  },
  alumno: {
    type: AlumnoType,
    description: 'Alumno por id',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {id}, {models}) {
      return models.Alumno.getById(id)
    }
  },
  alumnoByEmail: {
    type: AlumnoType,
    description: 'Alumno por Email',
    args: {
      email: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve(parent, {email}, {models}) {
      return models.Alumno.getByEmail(email.toLowerCase())
    }
  },
  separarApellidos: {
    type: AlumnoType,
    description: 'Separa apellidos',
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, {id}, {models}) {
      const alumnos = await models.Alumno.getAll()
      for (alumno of alumnos) {
        const arregloNombre = alumno.a_paterno.trim().split(' ')
        const fullName = []
        const palabrasReservadas = ['da', 'de', 'del', 'la', 'las', 'los', 'san', 'santa']
        let auxPalabra = ""
        arregloNombre.forEach(function (name) {
          if (palabrasReservadas.indexOf(name.toLowerCase()) !== -1)
            auxPalabra += name + ' '
          else {
            fullName.push(auxPalabra + name)
            auxPalabra = ""
          }
        })

        await models.Alumno.update({
          id: alumno.id,
          update: {
            nombres: alumno.nombres.toString().trim().toUpperCase(),
            a_paterno: fullName[0] ? fullName[0].toString().trim().toUpperCase() : '',
            a_materno: fullName[1] ? fullName[1].toString().trim().toUpperCase() : ''
          }
        })
      }

      return {
        id
      }
    }
  }
}