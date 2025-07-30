const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
    generatePromocionModel: user => ({
        create: ({codigo, descuento, fecha_inicio, fecha_fin, descripcion}) => {
            const query = pgp.as.format('INSERT INTO itec.promociones(codigo, descuento, fecha_inicio, fecha_fin, descripcion, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *')

            const values = [
                codigo,
                descuento,
                fecha_inicio,
                fecha_fin,
                descripcion,
                timestamp(),
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        getAll: () => {
            const query = pgp.as.format('SELECT * FROM itec.promociones WHERE deleted_at is NULL ORDER BY id DESC')

            return db.manyOrNone(query).then(res => res).catch(err => err)
        },
        getById: id => {
            const query = pgp.as.format('SELECT * FROM itec.promociones where id=$1')

            return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
        },
        getByCursoId: curso_id => {
            const query = pgp.as.format('SELECT p.* FROM itec.promocion_has_cursos as pc inner join itec.cursos c on c.id = pc.curso_id inner join itec.promociones as p on pc.promocion_id = p.id where c.id = $1 and p.deleted_at is NULL')

            return db.manyOrNone(query, [curso_id]).then(res => res).catch(err => err)
        },
        update: args => {
            const {set, values} = update(args)

            const query = pgp.as.format(`UPDATE itec.promociones SET ${set} WHERE id=$1 RETURNING *`)

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        delete: id => {
            const query = pgp.as.format(`UPDATE itec.promociones SET deleted_at=$2 WHERE id=$1 RETURNING *`)
            const values = [
                id,
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        }
    })
}