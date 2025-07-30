const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateReproduccionModel: user => ({
    create: async ({alumno_id, archivo_id, tiempo}) => {
      const query = pgp.as.format('INSERT INTO itec.reproducciones(alumno_id, archivo_id, tiempo, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *')

      const values = [
        alumno_id,
        archivo_id,
        tiempo,
        timestamp(),
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getAll: () => {
      // if (!user || !user.roles.includes('admin')) return null;

      const query = pgp.as.format('SELECT * FROM itec.reproducciones WHERE deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.reproducciones where id=$1')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    getByAlumnoIdArchivoId: (alumno_id, archivo_id) => {
      const query = pgp.as.format('SELECT * FROM itec.reproducciones where alumno_id=$1 AND archivo_id=$2 AND deleted_at is NULL order by id desc limit 1')

      return db.oneOrNone(query, [alumno_id, archivo_id]).then(res => res).catch(err => err)
    },
    update: async args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.reproducciones SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.reproducciones SET deleted_at=$2 WHERE id=$1 RETURNING *`)
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}