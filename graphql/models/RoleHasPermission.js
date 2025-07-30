const {db, pgp} = require("../../scripts/pgAdaptor")

module.exports = {
    generateRoleHasPermissionModel: user => ({
        create: ({permission_id, role_id}) => {
            const query = pgp.as.format('INSERT INTO itec.role_has_permissions(permission_id, role_id) VALUES ($1, $2) RETURNING *')

            const values = [
                permission_id,
                role_id
            ]

            return db.oneOrNone(query, values).then(res => res).catch(err => err)
        },
        getPermissionsByRole: role_id => {
            const query = pgp.as.format('select * from itec.role_has_permissions as rp inner join itec.permissions as p on rp.permission_id = p.id where role_id=$1')

            return db.manyOrNone(query, [role_id]).then(res => res).catch(err => err)
        },
        delete: role_id => {
            const query = pgp.as.format(`DELETE FROM itec.role_has_permissions WHERE role_id=$1 RETURNING *`)

            return db.oneOrNone(query, [role_id]).then(res => res).catch(err => err)
        }
    })
}