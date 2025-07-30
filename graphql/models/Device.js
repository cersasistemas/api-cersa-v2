const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateDeviceModel: user => ({
    create: ({alumno_id, device_id}) => {
      const query = pgp.as.format('INSERT INTO itec.devices(alumno_id, device_id, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *')

      const values = [
        alumno_id,
        device_id,
        true,
        timestamp(),
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getAll: () => {
      const query = pgp.as.format('SELECT * FROM itec.devices WHERE deleted_at is NULL ORDER BY id ASC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getAllByCursoId: curso_id => {
      const query = pgp.as.format('SELECT d.* FROM itec.matriculas as m inner join itec.devices as d on m.alumno_id = d.alumno_id WHERE m.curso_id=$1 AND m.deleted_at is NULL')

      return db.manyOrNone(query, [curso_id]).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.devices where id=$1 AND deleted_at is NULL')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    getByDeviceId: device_id => {
      const query = pgp.as.format('SELECT * FROM itec.devices where device_id=$1 AND deleted_at is NULL')

      return db.oneOrNone(query, [device_id]).then(res => res).catch(err => err)
    },
    update: args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.devices SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.devices SET deleted_at=$2 WHERE id=$1 RETURNING *`)
      
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}