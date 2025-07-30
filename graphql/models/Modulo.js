const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
    generateModuloModel: user => ({
        create: ({curso_id, nombre}) => {
            const query = pgp.as.format('INSERT INTO itec.modulos(curso_id, nombre, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *')

            const values = [
                curso_id,
                nombre,
                timestamp(),
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        getAll: () => {
            const query = pgp.as.format('SELECT * FROM itec.modulos WHERE deleted_at is NULL ORDER BY id DESC')

            return db.manyOrNone(query).then(res => res).catch(err => err)
        },
        getAllByCursoId: curso_id => {
            const query = pgp.as.format('SELECT * FROM itec.modulos WHERE curso_id=$1 AND deleted_at is NULL ORDER BY id DESC')

            return db.manyOrNone(query, [curso_id]).then(res => res).catch(err => err)
        },
        getMultimediaByCursoId: curso_id => {
            const query = pgp.as.format('SELECT * FROM itec.modulos WHERE curso_id=$1 AND nombre<>$2 AND deleted_at is NULL ORDER BY id DESC')

            return db.manyOrNone(query, [curso_id, 'RECURSOS']).then(res => res).catch(err => err)
        },
        getById: id => {
            const query = pgp.as.format('SELECT * FROM itec.modulos where id=$1')

            return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
        },
        update: args => {
            const {set, values} = update(args)

            const query = pgp.as.format(`UPDATE itec.modulos SET ${set} WHERE id=$1 RETURNING *`)

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        delete: id => {
            const query = pgp.as.format(`UPDATE itec.modulos SET deleted_at=$2 WHERE id=$1 RETURNING *`)
            const values = [
                id,
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        }
    })
}