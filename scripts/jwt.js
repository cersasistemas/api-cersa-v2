const jwt = require("jsonwebtoken")
require('dotenv').config()

const {generatePermissionModel} = require("../graphql/models/Permission")
const {generateRoleModel} = require("../graphql/models/Role")

module.exports = {
  createToken: async user => {
    const {id, email, nombres, a_paterno, a_materno, avatar, role_id} = user

    const role = await generateRoleModel(user).getById(role_id)
    let permissions = await generatePermissionModel(user).getAllByRoleId(role_id)
    permissions = permissions ? permissions.map(({nombre}) => nombre) : []

    const payload = {
      id,
      sub: `${nombres ? `${nombres} ` : ''}${a_paterno ? `${a_paterno} ` : ''}${a_materno ? a_materno : ''}`,
      email,
      role: role ? role.nombre : 'Alumno'
    }

    return {
      ...payload,
      nombres: `${nombres ? `${nombres} ` : ''}${a_paterno ? `${a_paterno} ` : ''}${a_materno ? a_materno : ''}`,
      authentication: jwt.sign(payload, process.env.AUTH_JWT_SECRET, {expiresIn: "1d"}),
      permissions,
      avatar
    }
  },
  decodeToken: authorization => jwt.decode(authorization),
  verifyToken: authorization => jwt.verify(authorization, process.env.AUTH_JWT_SECRET)
}