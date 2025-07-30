const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp, passwordHash} = require("../../scripts/utils")

module.exports = {
    generateUserModel: user => ({
        create: async ({email, nombres, a_paterno, a_materno, avatar, password, role_id}) => {
            const query = pgp.as.format('INSERT INTO itec.users(email, nombres, a_paterno, a_materno, avatar, password, role_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *')

            const values = [
                email,
                nombres,
                a_paterno,
                a_materno,
                avatar,
                await passwordHash(password),
                role_id,
                timestamp(),
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        getAll: () => {
            // if (!user || !user.roles.includes('admin')) return null;

            const query = pgp.as.format('SELECT * FROM itec.users WHERE deleted_at is NULL ORDER BY id DESC')

            return db.manyOrNone(query).then(res => res).catch(err => err)
        },
        getById: id => {
            const query = pgp.as.format('SELECT * FROM itec.users where id=$1')

            return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
        },
        getByEmail: email => {
            const query = pgp.as.format('SELECT * FROM itec.users where email=$1 AND deleted_at is NULL')

            return db.oneOrNone(query, [email]).then(res => res).catch(err => err)
        },
        update: async args => {
            const password = args.update.password !== '' && args.update.password ? await passwordHash(args.update.password) : ''

            if (password !== '')
                args.update.password = password
            else
                delete args.update.password

            const {set, values} = update(args)

            const query = pgp.as.format(`UPDATE itec.users SET ${set} WHERE id=$1 RETURNING *`)

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        delete: id => {
            const query = pgp.as.format(`UPDATE itec.users SET deleted_at=$2 WHERE id=$1 RETURNING *`)
            const values = [
                id,
                timestamp()
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        }
    })
}