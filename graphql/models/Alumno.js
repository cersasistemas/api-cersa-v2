const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp, passwordHash} = require("../../scripts/utils")

module.exports = {
  generateAlumnoModel: user => ({
    create: async ({siglas, nombres, a_paterno, a_materno, nacimiento, dni, celular, avatar, direccion, departamento, provincia, distrito, profesion, email, password, password_f, password_g, pais, alumno_mysql}) => {
      const query = pgp.as.format('INSERT INTO itec.alumnos(siglas, nombres, a_paterno, a_materno, nacimiento, dni, celular, avatar, direccion, departamento, provincia, distrito, profesion, email, password, password_f, password_g, created_at, updated_at, pais, alumno_mysql) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *')

      const values = [
        siglas,
        nombres,
        a_paterno,
        a_materno,
        nacimiento,
        dni,
        celular,
        avatar,
        direccion,
        departamento ? departamento : null,
        provincia ? departamento : null,
        distrito ? distrito : null,
        profesion,
        email.toLowerCase(),
        await passwordHash(password ? password : dni),
        await passwordHash(password_f ? password_f : ''),
        await passwordHash(password_g ? password_g : ''),
        timestamp(),
        timestamp(),
        pais ? pais : 'PE',
        alumno_mysql
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getAll: () => {
      const query = pgp.as.format('SELECT * FROM itec.alumnos WHERE deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.alumnos where id=$1')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    getByEmail: email => {
      const query = pgp.as.format('SELECT * FROM itec.alumnos where email=$1 AND deleted_at is NULL')

      return db.oneOrNone(query, [email]).then(res => res).catch(err => err)
    },
    update: async args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.alumnos SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.alumnos SET deleted_at=$2 WHERE id=$1 RETURNING *`)
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}