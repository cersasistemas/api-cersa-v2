const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateCommentModel: user => ({
    create: ({persona_id, model, comentario_id, comentario, type, archivo_id}) => {
      const query = pgp.as.format('INSERT INTO itec.comentarios(persona_id, model, comentario_id, comentario, type, archivo_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *')

      const values = [
        persona_id,
        model,
        comentario_id,
        comentario,
        type,
        archivo_id,
        timestamp(),
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getAllArchivoId: archivo_id => {
      const query = pgp.as.format('SELECT * FROM itec.comentarios WHERE archivo_id=$1 and comentario_id is NULL and deleted_at is NULL order by created_at asc')

      return db.manyOrNone(query, [archivo_id]).then(res => res).catch(err => err)
    },
    getAllArchivoIdDesc: archivo_id => {
      const query = pgp.as.format('SELECT * FROM itec.comentarios WHERE archivo_id=$1 and comentario_id is NULL and deleted_at is NULL order by created_at desc')

      return db.manyOrNone(query, [archivo_id]).then(res => res).catch(err => err)
    },
    getAllCommentId: comentario_id => {
      const query = pgp.as.format('SELECT * FROM itec.comentarios WHERE comentario_id=$1 and deleted_at is NULL order by created_at desc')

      return db.manyOrNone(query, [comentario_id]).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.comentarios where id=$1')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    update: args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.comentarios SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.comentarios SET deleted_at=$2 WHERE id=$1 RETURNING *`)
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}