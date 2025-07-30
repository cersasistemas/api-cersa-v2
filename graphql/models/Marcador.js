const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateMarcadorModel: user => ({
    create: async ({alumno_id, archivo_id, marker, time}) => {
      const query = pgp.as.format('INSERT INTO itec.marcadores(alumno_id, archivo_id, marker, time, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *')

      const values = [
        alumno_id,
        archivo_id,
        marker,
        time,
        timestamp(),
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getAllByAlumnoIdAndArchivoId: (alumno_id, archivo_id) => {
      const query = pgp.as.format('SELECT * FROM itec.marcadores WHERE alumno_id=$1 AND archivo_id=$2 AND deleted_at is NULL')

      return db.manyOrNone(query, [alumno_id, archivo_id]).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.marcadores where id=$1')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    update: async args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.marcadores SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.marcadores SET deleted_at=$2 WHERE id=$1 RETURNING *`)
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}