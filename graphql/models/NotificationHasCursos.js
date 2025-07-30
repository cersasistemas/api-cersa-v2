const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateNotificationHasCursosModel: user => ({
    create: ({notification_id, curso_id}) => {
      const query = pgp.as.format('INSERT INTO itec.notification_has_cursos(notification_id, curso_id, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *')

      const values = [
        notification_id,
        curso_id,
        timestamp(),
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getAll: () => {
      const query = pgp.as.format('SELECT * FROM itec.notification_has_cursos WHERE deleted_at is NULL ORDER BY id ASC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getAllByNotificacionId: curso_id => {
      const query = pgp.as.format('select nhc.* from itec.notification_has_cursos as nhc inner join itec.cursos as c on nhc.curso_id = c.id where nhc.curso_id=$1 AND nhc.deleted_at is NULL')

      return db.manyOrNone(query, [curso_id]).then(res => res).catch(err => err)
    },
    getAllByCursoId: notification_id => {
      const query = pgp.as.format('select c.* from itec.notification_has_cursos as nhc inner join itec.cursos as c on nhc.curso_id = c.id where nhc.notification_id=$1 AND nhc.deleted_at is NULL')

      return db.manyOrNone(query, [notification_id]).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.notification_has_cursos where id=$1 AND deleted_at is NULL')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    update: args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.notification_has_cursos SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: ({notification_id, curso_id}) => {
      const query = pgp.as.format(`UPDATE itec.notification_has_cursos SET notification_id=$2 AND curso_id=$3 WHERE id=$1 RETURNING *`)

      const values = [
        notification_id,
        curso_id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}