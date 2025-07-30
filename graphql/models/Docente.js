const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
    generateDocenteModel: user => ({
        create: ({dni, nombres, a_paterno, a_materno, avatar, descripcion, cv}) => {
            const query = pgp.as.format('INSERT INTO itec.docentes(dni, nombres, a_paterno, a_materno, avatar, descripcion, cv, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *')

            const values = [
                dni,
                nombres,
                a_paterno,
                a_materno,
                avatar,
                descripcion,
                cv,
                timestamp(),
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        getAll: () => {
            const query = pgp.as.format('SELECT * FROM itec.docentes WHERE deleted_at is NULL ORDER BY id DESC')

            return db.manyOrNone(query).then(res => res).catch(err => err)
        },
        getById: id => {
            const query = pgp.as.format('SELECT * FROM itec.docentes where id=$1')

            return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
        },
        update: args => {
            const {set, values} = update(args)

            const query = pgp.as.format(`UPDATE itec.docentes SET ${set} WHERE id=$1 RETURNING *`)

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        delete: id => {
            const query = pgp.as.format(`UPDATE itec.docentes SET deleted_at=$2 WHERE id=$1 RETURNING *`)
            const values = [
                id,
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        }
    })
}