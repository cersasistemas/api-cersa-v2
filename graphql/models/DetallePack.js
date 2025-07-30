const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateDetallePackModel: user => ({
    create: ({pack_id, curso_id, precio, descuento}) => {
      const query = pgp.as.format('INSERT INTO itec.detalle_packs(pack_id, curso_id, precio, descuento, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *')

      return db.oneOrNone(query, [
        pack_id,
        curso_id,
        precio,
        descuento,
        timestamp(),
        timestamp()
      ]).then(res => res).catch(err => err)
    },
    getAllByPackId: pack_id => {
      const query = pgp.as.format('SELECT * FROM itec.detalle_packs WHERE pack_id=$1 AND deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query, [pack_id]).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.detalle_packs where id=$1')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    update: args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.detalle_packs SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.detalle_packs SET deleted_at=$2 WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, [
        id,
        timestamp()
      ]).then(res => res).catch(err => err)
    }
  })
}