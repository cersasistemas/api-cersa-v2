const {db, pgp} = require("../../scripts/pgAdaptor")
const {timestamp} = require("../../scripts/utils")

module.exports = {
  generatePromocionHasCursosModel: user => ({
    create: ({promocion_id, curso_id}) => {
      const query = pgp.as.format('INSERT INTO itec.promocion_has_cursos(promocion_id, curso_id, created_at) VALUES ($1, $2, $3) RETURNING *')

      const values = [
        promocion_id,
        curso_id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getByPromocionIdCursoId: (promocion_id, curso_id) => {
      const query = pgp.as.format('SELECT * FROM itec.promocion_has_cursos where promocion_id=$1 AND curso_id=$2 AND deleted_at is NULL')

      return db.oneOrNone(query, [promocion_id, curso_id]).then(res => res).catch(err => err)
    },
    delete: (promocion_id, curso_id) => {
      const query = pgp.as.format(`UPDATE itec.promocion_has_cursos SET deleted_at=$3 WHERE promocion_id=$1 AND curso_id=$2 RETURNING *`)
      const values = [
        promocion_id,
        curso_id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}