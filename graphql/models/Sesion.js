const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateSesionModel: user => ({
    create: ({curso_id, nombre, descripcion, link, password, dias, fecha, reunion_id, recurrente, recurrencia, fecha_finalizacion, duracion}) => {
      const query = pgp.as.format('INSERT INTO itec.sesiones(curso_id, nombre, descripcion, link, password, dias, fecha, reunion_id, recurrente, recurrencia, fecha_finalizacion, duracion, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *')

      return db.oneOrNone(query, [
        curso_id,
        nombre,
        descripcion,
        link,
        password,
        JSON.stringify(dias),
        fecha.replace(/T/g, " ").padEnd(19, ':00'),
        reunion_id,
        recurrente,
        recurrencia,
        fecha_finalizacion !== '' ? fecha_finalizacion : null,
        duracion ? duracion : null,
        timestamp(),
        timestamp()
      ]).then(res => res).catch(err => err)
    },
    getAll: curso_id => {
      const query = pgp.as.format('SELECT * FROM itec.sesiones WHERE curso_id=$1 AND deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query, [curso_id]).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.sesiones where id=$1')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    update: args => {
      args.update.dias = JSON.stringify(args.update.dias)
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.sesiones SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.sesiones SET deleted_at=$2 WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, [
        id,
        timestamp()
      ]).then(res => res).catch(err => err)
    }
  })
}