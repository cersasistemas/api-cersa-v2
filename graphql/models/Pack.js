const uniqid = require('uniqid')

const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generatePackModel: user => ({
    create: ({alumno_email, payu_id, fecha_emision, moneda, observaciones, importe, voucher}) => {
      const query = pgp.as.format('INSERT INTO itec.packs(alumno_email, payu_id, fecha_emision, moneda, observaciones, estado, importe, voucher, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *')

      return db.oneOrNone(query, [
        alumno_email,
        payu_id ? payu_id : uniqid.time().toString().toUpperCase(),
        fecha_emision ? fecha_emision : timestamp(),
        moneda,
        observaciones,
        false,
        importe,
        voucher,
        timestamp(),
        timestamp()
      ]).then(res => res).catch(err => err)
    },
    getAll: () => {
      const query = pgp.as.format('SELECT * FROM itec.packs WHERE deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.packs where id=$1')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    getPendientes: () => {
      const query = pgp.as.format('SELECT * FROM itec.packs where estado=false and deleted_at is null ORDER BY created_at DESC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    update: args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.packs SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.packs SET deleted_at=$2 WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, [
        id,
        timestamp()
      ]).then(res => res).catch(err => err)
    }
  })
}