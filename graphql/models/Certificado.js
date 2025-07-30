const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateCertificadoModel: user => ({
    create: ({codigo, matricula_id, nota, lado_uno, lado_dos, tipo, taller_dias}) => {
      const query = pgp.as.format('INSERT INTO itec.certificados(codigo, matricula_id, nota, lado_uno, lado_dos, tipo, taller_dias, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *')

      const values = [
        codigo,
        matricula_id,
        nota,
        lado_uno,
        lado_dos,
        tipo,
        taller_dias,
        timestamp(),
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getAll: () => {
      const query = pgp.as.format('SELECT * FROM itec.certificados WHERE deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getLast: () => {
      const query = pgp.as.format('SELECT * FROM itec.certificados where deleted_at is NULL ORDER BY id desc limit 1')

      return db.oneOrNone(query).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.certificados where id=$1 AND deleted_at is NULL')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    getByCodigo: codigo => {
      const query = pgp.as.format('SELECT * FROM itec.certificados where codigo=$1 AND deleted_at is NULL')

      return db.oneOrNone(query, [codigo]).then(res => res).catch(err => err)
    },
    getByMatriculaId: matricula_id => {
      const query = pgp.as.format('SELECT * FROM itec.certificados where matricula_id=$1 AND deleted_at is NULL')

      return db.oneOrNone(query, [matricula_id]).then(res => res).catch(err => err)
    },
    update: args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.certificados SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.certificados SET deleted_at=$2 WHERE id=$1 RETURNING *`)
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}