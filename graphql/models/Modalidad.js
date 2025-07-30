const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
    generateModalidadModel: user => ({
        create: ({nombre, descripcion}) => {
            const query = pgp.as.format('INSERT INTO itec.modalidades(nombre, descripcion, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *')

            const values = [
                nombre,
                descripcion,
                timestamp(),
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        getAll: () => {
            const query = pgp.as.format('SELECT * FROM itec.modalidades WHERE deleted_at is NULL ORDER BY id DESC')

            return db.manyOrNone(query).then(res => res).catch(err => err)
        },
        getById: id => {
            const query = pgp.as.format('SELECT * FROM itec.modalidades where id=$1')

            return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
        },
        update: args => {
            const {set, values} = update(args)

            const query = pgp.as.format(`UPDATE itec.modalidades SET ${set} WHERE id=$1 RETURNING *`)

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        delete: id => {
            const query = pgp.as.format(`UPDATE itec.modalidades SET deleted_at=$2 WHERE id=$1 RETURNING *`)

            const values = [
                id,
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        }
    })
}