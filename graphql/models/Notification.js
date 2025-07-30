const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateNotificationModel: user => ({
    create: ({nombre, now, send_at, message, tipo}) => {
      const query = pgp.as.format('INSERT INTO itec.notifications(nombre, now, send_at, message, tipo, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *')

      const values = [
        nombre,
        now,
        send_at,
        message,
        tipo,
        timestamp(),
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getAll: () => {
      const query = pgp.as.format('SELECT * FROM itec.notifications WHERE deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getAllByType: tipo => {
      const query = pgp.as.format('SELECT * FROM itec.notifications WHERE tipo=$1 and deleted_at is NULL ORDER BY id ASC')

      return db.manyOrNone(query, [tipo]).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.notifications where id=$1 AND deleted_at is NULL')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    update: args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.notifications SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    read: id => {
      const query = pgp.as.format(`UPDATE itec.notifications SET readed_at=$2 WHERE id=$1 RETURNING *`)
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.notifications SET deleted_at=$2 WHERE id=$1 RETURNING *`)
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}