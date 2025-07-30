const {GraphQLNonNull, GraphQLString} = require("graphql")

const {createToken, verifyToken} = require("../../scripts/jwt")
const {UserType} = require("../type")
const {timestamp, passwordHash} = require("../../scripts/utils")
const AlumnoMysql = require("../modelsMysql/Alumno")
const sendEmail = require("../../scripts/email")

module.exports = {
  passwordReset: {
    type: UserType,
    args: {
      email: {type: GraphQLNonNull(GraphQLString)},
      password: {type: GraphQLNonNull(GraphQLString)},
      token: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, {email, password, token}, {user, models}) {
      const validate = verifyToken(token)

      if (validate.email === null)
        return {
          authentication: 'old'
        }

      let alumno = await models.User.getByEmail(email.toLowerCase())

      if (alumno) {
        await models.User.update({id: alumno.id, update: {password}})

        return createToken(alumno)
      }

      alumno = await models.Alumno.getByEmail(email.toLowerCase())
      const newPassword = await passwordHash(password)
      await models.Alumno.update({id: alumno.id, update: {password: newPassword}})
      await AlumnoMysql.update({password: newPassword, id: alumno.alumno_mysql})

      user.email = email.toLowerCase()
      await sendEmail({
        user, tipo: 'register', alumno: {
          ...alumno,
          password
        }
      })

      return {
        authentication: 'cersa.org.pe'
      }
    }
  },
  emailConfirmation: {
    type: UserType,
    args: {
      token: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, {token}, {models}) {
      const validate = verifyToken(token)

      if (validate.email === null)
        return null

      let user = await models.User.getByEmail(validate.email.toLowerCase())
      user = await createToken(user)

      await models.User.update({id: user.id, update: {email_verified_at: timestamp()}})

      return user
    }
  }
}