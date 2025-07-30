const {GraphQLNonNull, GraphQLString} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const bcrypt = require("bcrypt")
const moment = require("moment")

const {UserType} = require("../type")
const {createToken, decodeToken} = require("../../scripts/jwt")
const sendEmail = require("../../scripts/email")
const AlumnoMysql = require("../modelsMysql/Alumno")

let alumno = {
  siglas: '',
  nombres: '',
  a_paterno: '',
  a_materno: '',
  nacimiento: '',
  dni: '',
  celular: '',
  avatar: '',
  direccion: '',
  departamento: '',
  provincia: '',
  distrito: '',
  profesion: '',
  email: '',
  password: 'xKDf3?VBzKXX&qRg3BhfA&jcj4akQN',
  password_f: 'xKDf3?VBzKXX&qRg3BhfA&jcj4akQN',
  password_g: 'xKDf3?VBzKXX&qRg3BhfA&jcj4akQN',
}

module.exports = {
  login: {
    type: UserType,
    args: {
      email: {type: GraphQLNonNull(GraphQLString)},
      password: {type: GraphQLNonNull(GraphQLString)},
      social: {type: GraphQLNonNull(GraphQLJSON)}
    },
    async resolve(parent, {email, password, social}, {models}) {
      let user = {}

      social.email = social.email ? social.email.toLowerCase() : social.id
      switch (social.type) {
        case 'facebook':
          user = await models.Alumno.getByEmail(social.email)
          let avatarf = user ? user.avatar : ''

          alumno = {
            ...alumno,
            nombres: social.first_name,
            a_paterno: social.last_name,
            nacimiento: social.birthday ? moment(social.birthday, 'MM/DD/YYYY').format('YYYY-MM-DD') : null,
            email: social.email,
            password_f: `${social.id}@<3`,
            avatar: avatarf.includes('https://') || avatarf === '' ? social.picture.data.url : avatarf // si eh subido mi foto manualmente (path inicial con /) no se debe actualizar con de la redsocial
          }

          password = alumno.password_f
          if (user) {
            user.password_f = await bcrypt.hash(alumno.password_f, 10)
            user.avatar = alumno.avatar
            delete user.updated_at
            user = await models.Alumno.update({id: user.id, update: user})
          } else {
            let alumnoMysql = await AlumnoMysql.getByEmail(alumno.email)

            if (!alumnoMysql) {
              alumnoMysql = await AlumnoMysql.create(alumno)
              alumnoMysql.mysl = alumnoMysql.insertId
            } else
              alumnoMysql.mysl = alumnoMysql.id

            user = await models.Alumno.create({...alumno, alumno_mysql: alumnoMysql.mysl})
          }

          user.password = user.password_f
          break
        case 'google':
          user = await models.Alumno.getByEmail(social.user.email.toLowerCase())
          const avatarg = user ? user.avatar : ''

          alumno = {
            ...alumno,
            nombres: social.user.givenName,
            a_paterno: social.user.familyName,
            email: social.user.email.toLowerCase(),
            password_g: `${social.user.id}<3@`,
            avatar: avatarg.includes('https://') ? social.user.photo : avatarg
          }

          password = alumno.password_g
          if (user) {
            user.password_g = await bcrypt.hash(alumno.password_g, 10)
            user.avatar = avatarg.includes('https://') ? social.user.photo : avatarg
            delete user.updated_at
            user = await models.Alumno.update({id: user.id, update: user})
          } else {
            let alumnoMysql = await AlumnoMysql.getByEmail(alumno.email)

            if (!alumnoMysql) {
              alumnoMysql = await AlumnoMysql.create(alumno)
              alumnoMysql.mysl = alumnoMysql.insertId
            } else
              alumnoMysql.mysl = alumnoMysql.id

            user = await models.Alumno.create({...alumno, alumno_mysql: alumnoMysql.mysl})
          }
          user.password = user.password_g
          break
        case 'mobil':
          user = await models.Alumno.getByEmail(email.toLowerCase())
          break
        case 'web':
          user = await models.User.getByEmail(email.toLowerCase())
          break
      }
      console.log(user)
      if (user.password && await bcrypt.compare(password, user.password.replace(/^\$2y/, '$2b')))
        return createToken(user)

      return null
    }
  },
  refresh: {
    type: UserType,
    args: {
      authorization: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, {authorization}, {models}) {
      authorization = decodeToken(authorization)

      if (authorization.email) {
        let user = await models.User.getByEmail(authorization.email.toLowerCase())

        return createToken(user)
      }

      return null
    }
  },
  reset: {
    type: UserType,
    args: {
      email: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, {email}, {models}) {
      let user = await models.User.getByEmail(email.toLowerCase())

      if (user)
        user.authentication = undefined
      else {
        user = await models.Alumno.getByEmail(email.toLowerCase())
        user.email_verified_at = undefined
      }

      if (user.email_verified_at === null)
        return {
          authentication: 'reset'
        }

      if (user.email)
        return await sendEmail({user, tipo: 'reset'})

      return null
    }
  },
  verify: {
    type: UserType,
    args: {
      token: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, {token}, {models}) {
      const {email} = decodeToken(token)
      let user = await models.User.getByEmail(email.toLowerCase())

      user.authentication = undefined

      if (user.email)
        return await sendEmail({user, tipo: 'verify'})

      return null
    }
  }
}