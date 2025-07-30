const {db, pgp} = require("../../scripts/pgAdaptor")
const {timestamp} = require("../../scripts/utils")

module.exports = {
  generateLikeModel: user => ({
    create: async ({comentario_id, persona_id, model}) => {
      const query = pgp.as.format('INSERT INTO itec.likes(comentario_id, persona_id, model, created_at) VALUES ($1, $2, $3, $4) RETURNING *')

      const values = [
        comentario_id,
        persona_id,
        model,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getLikesByCommentId: comentario_id => {
      const query = pgp.as.format('SELECT count(*) as comentario_id FROM cersa.itec.likes where comentario_id=$1')

      return db.oneOrNone(query, [comentario_id]).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.likes SET deleted_at=$2 WHERE id=$1 RETURNING *`)
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}