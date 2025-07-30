const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateSesionDiasModel: user => ({
    create: ({sesion_id, fecha, onesignal_id, session}) => {
      const query = pgp.as.format('INSERT INTO itec.sesion_dias(sesion_id, fecha, onesignal_id, session, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *')

      return db.oneOrNone(query, [
        sesion_id,
        fecha,
        onesignal_id,
        session ? session : false,
        timestamp(),
        timestamp()
      ]).then(res => res).catch(err => err)
    },
    getAll: sesion_id => {
      const query = pgp.as.format('SELECT * FROM itec.sesion_dias WHERE sesion_id=$1 AND deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query, [sesion_id]).then(res => res).catch(err => err)
    },
    getAllActivas: sesion_id => {
      const query = pgp.as.format('SELECT * FROM itec.sesion_dias WHERE sesion_id=$1 AND deleted_at is NULL AND session=true ORDER BY id DESC')

      return db.manyOrNone(query, [sesion_id]).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.sesion_dias where id=$1')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    update: args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.sesion_dias SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.sesion_dias SET deleted_at=$2 WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, [
        id,
        timestamp()
      ]).then(res => res).catch(err => err)
    }
  })
}