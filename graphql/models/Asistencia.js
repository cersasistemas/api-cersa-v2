const {db, pgp} = require("../../scripts/pgAdaptor")
const {timestamp} = require("../../scripts/utils")

module.exports = {
  generateAsistenciaModel: user => ({
    create: ({sesion_dia_id, alumno_id}) => {
      const query = pgp.as.format('INSERT INTO itec.asistencias(sesion_dia_id, alumno_id, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *')

      const values = [
        sesion_dia_id,
        alumno_id,
        timestamp(),
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getBySesionDiaIdAlumnoId: (sesion_dia_id, alumno_id) => {
      const query = pgp.as.format('SELECT * FROM itec.asistencias where sesion_dia_id=$1 AND alumno_id=$2 AND deleted_at is NULL')

      return db.oneOrNone(query, [sesion_dia_id, alumno_id]).then(res => res).catch(err => err)
    },
    delete: (sesion_dia_id, alumno_id) => {
      const query = pgp.as.format(`UPDATE itec.asistencias SET deleted_at=$3 WHERE sesion_dia_id=$1 AND alumno_id=$2 RETURNING *`)
      const values = [
        sesion_dia_id,
        alumno_id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}