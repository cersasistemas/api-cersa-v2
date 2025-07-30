const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
    generateRoleModel: user => ({
        create: ({nombre}) => {
            const query = pgp.as.format('INSERT INTO itec.roles(nombre, created_at, updated_at) VALUES ($1, $2, $3) RETURNING *')

            const values = [
                nombre,
                timestamp(),
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        getAll: () => {
            const query = pgp.as.format('SELECT * FROM itec.roles WHERE deleted_at is NULL ORDER BY id ASC')

            return db.manyOrNone(query).then(res => res).catch(err => err)
        },
        getById: id => {
            const query = pgp.as.format('SELECT * FROM itec.roles where id=$1 AND deleted_at is NULL')

            return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
        },
        update: args => {
            const {set, values} = update(args)

            const query = pgp.as.format(`UPDATE itec.roles SET ${set} WHERE id=$1 RETURNING *`)

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        delete: id => {
            const query = pgp.as.format(`UPDATE itec.roles SET deleted_at=$2 WHERE id=$1 RETURNING *`)
            const values = [
                id,
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        }
    })
}