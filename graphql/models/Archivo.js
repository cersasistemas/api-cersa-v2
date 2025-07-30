const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateArchivoModel: user => ({
    create: ({modulo_id, nombre, link, tipo, tamanio, calidad, duracion, html, orden}) => {
      const query = pgp.as.format('INSERT INTO itec.archivos(modulo_id, nombre, link, tipo, tamanio, calidad, duracion, html, orden, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *')

      const values = [
        modulo_id,
        nombre,
        link,
        tipo,
        tamanio,
        calidad,
        duracion,
        html,
        orden,
        timestamp(),
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getAll: () => {
      const query = pgp.as.format('SELECT * FROM itec.archivos WHERE deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getByIsPublic: (modulo_id, is_public) => {
      const query = pgp.as.format('SELECT * FROM itec.archivos WHERE modulo_id=$1 AND is_public=$2 AND deleted_at is NULL ORDER BY orden ASC')

      return db.manyOrNone(query, [modulo_id, is_public]).then(res => res).catch(err => err)
    },
    getAllByModuloId: modulo_id => {
      const query = pgp.as.format('SELECT * FROM itec.archivos WHERE modulo_id=$1 AND deleted_at is NULL ORDER BY orden ASC')

      return db.manyOrNone(query, [modulo_id]).then(res => res).catch(err => err)
    },
    getAllByCursoId: curso_id => {
      const query = pgp.as.format('select a.* from itec.cursos as c inner join itec.modulos as m on c.id = m.curso_id inner join itec.archivos as a on m.id = a.modulo_id where c.id=$1 and m.deleted_at is null')

      return db.manyOrNone(query, [curso_id]).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.archivos where id=$1')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    update: args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.archivos SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.archivos SET deleted_at=$2 WHERE id=$1 RETURNING *`)
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  }),
}