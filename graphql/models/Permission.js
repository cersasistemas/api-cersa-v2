const {db, pgp} = require("../../scripts/pgAdaptor")

module.exports = {
    generatePermissionModel: user => ({
        getAll: () => {
            const query = pgp.as.format('SELECT * FROM itec.permissions')

            return db.manyOrNone(query).then(res => res).catch(err => err)
        },
        getAllByRoleId: role_id => {
            const query = pgp.as.format('select nombre from itec.permissions inner join itec.role_has_permissions rhp on permissions.id = rhp.permission_id where role_id=$1 and deleted_at is null')

            return db.manyOrNone(query, [role_id]).then(res => res).catch(err => err)
        }
    })
}