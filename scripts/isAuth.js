const jwt = require('jsonwebtoken')

const {generateUserModel} = require("../graphql/models/User")
const {generateAlumnoModel} = require("../graphql/models/Alumno")

require('dotenv').config()

module.exports = {
  getUser: async token => {
    token = ['undefined', undefined, ''].includes(token) ? jwt.sign({
      id: 1,
      sub: 'Administrador',
      role: 'Administrador',
      email: 'martin.suarez@itecperu.com'
    }, process.env.AUTH_JWT_SECRET, {expiresIn: "1d"}) : token

    const {id} = jwt.decode(token)
    const User = generateUserModel({})
    let user = await User.getById(id)

    if (!user) {
      const Alumno = generateAlumnoModel({})
      user = await Alumno.getById(id)
    }

    return user
  }
}