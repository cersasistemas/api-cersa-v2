const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateMatriculaModel: user => ({
    create: ({
               curso_id,
               alumno_id,
               pago,
               descuento,
               fecha_pago,
               nuevo,
               voucher,
               descripcion,
               estado,
               matricula_mysql,
               drive
             }) => {
      const query = pgp.as.format('INSERT INTO itec.matriculas(curso_id, alumno_id, pago,  descuento, fecha_pago, nuevo, voucher, descripcion, estado, created_at, updated_at, matricula_mysql, user_id, drive) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *')

      const values = [
        curso_id,
        alumno_id,
        pago,
        descuento,
        fecha_pago,
        nuevo,
        voucher,
        descripcion,
        estado,
        timestamp(),
        timestamp(),
        matricula_mysql ? matricula_mysql : null,
        user.id,
        drive
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getAll: () => {
      const query = pgp.as.format('SELECT * FROM itec.matriculas WHERE deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getAllByCursoId: curso_id => {
      const query = pgp.as.format('SELECT * FROM itec.matriculas WHERE curso_id=$1 AND deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query, [curso_id]).then(res => res).catch(err => err)
    },
    getAllByCursoIdGroup: curso_id => {
      const query = pgp.as.format('SELECT fecha_pago, count(fecha_pago) as cantidad FROM itec.matriculas WHERE curso_id=$1 AND deleted_at is NULL GROUP BY fecha_pago ORDER BY fecha_pago ASC')

      return db.manyOrNone(query, [curso_id]).then(res => res).catch(err => err)
    },
    getAllByCursoIdGroupMonthYear: (curso_id, time) => {
      const query = pgp.as.format("SELECT date_trunc($2, fecha_pago) as fecha_pago, count(fecha_pago) as cantidad FROM itec.matriculas WHERE curso_id=$1 AND deleted_at is NULL GROUP BY date_trunc($2, fecha_pago) ORDER BY fecha_pago ASC")

      return db.manyOrNone(query, [curso_id, time]).then(res => res).catch(err => err)
    },
    getAllByCursoIdGroupImporte: curso_id => {
      const query = pgp.as.format('SELECT fecha_pago, sum(pago) as importe FROM itec.matriculas WHERE curso_id=$1 AND deleted_at is NULL GROUP BY fecha_pago ORDER BY fecha_pago ASC')

      return db.manyOrNone(query, [curso_id]).then(res => res).catch(err => err)
    },
    getAllByCursoIdGroupImporteMonthYear: (curso_id, time) => {
      const query = pgp.as.format("SELECT date_trunc($2, fecha_pago) as fecha_pago, sum(pago) as importe FROM itec.matriculas WHERE curso_id=$1 AND deleted_at is NULL GROUP BY date_trunc($2, fecha_pago) ORDER BY fecha_pago ASC")

      return db.manyOrNone(query, [curso_id, time]).then(res => res).catch(err => err)
    },
    getAllAlumnos: () => {
      const query = pgp.as.format('SELECT curso_id, count($1) as alumnos FROM itec.matriculas WHERE deleted_at is NULL GROUP BY curso_id order by alumnos desc limit 20')

      return db.manyOrNone(query, ['curso_id']).then(res => res).catch(err => err)
    },
    getAllImportes: () => {
      const query = pgp.as.format('SELECT curso_id, sum(pago) as importe FROM itec.matriculas WHERE deleted_at is NULL GROUP BY curso_id order by importe desc limit 20')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getAllByAlumnoId: alumno_id => {
      const query = pgp.as.format('SELECT * FROM itec.matriculas WHERE alumno_id=$1 AND deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query, [alumno_id]).then(res => res).catch(err => err)
    },
    getAllByCursoIdAndAlumnoId: (curso_id, alumno_id) => {
      const query = pgp.as.format('SELECT * FROM itec.matriculas WHERE curso_id=$1 AND alumno_id=$2 AND deleted_at is NULL')

      return db.oneOrNone(query, [curso_id, alumno_id]).then(res => res).catch(err => err)
    },
    getByAlumnoIdAndEstado: (alumno_id, is_activa) => {
      const query = pgp.as.format('SELECT * FROM itec.matriculas WHERE alumno_id=$1 AND estado=$2 AND deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query, [alumno_id, is_activa]).then(res => res).catch(err => err)
    },
    getPendientes: () => {
      const query = pgp.as.format('SELECT * FROM itec.matriculas where estado=false and deleted_at is null ORDER BY created_at DESC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.matriculas where id=$1')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    getValoracionCurso: id => {
      const query = pgp.as.format('select avg(valoracion_curso) as valoracion_curso from itec.matriculas where curso_id=$1 and valoracion_curso <> 0')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    getValoracionDocente: id => {
      const query = pgp.as.format('select avg(valoracion_docente) as valoracion_docente from itec.matriculas where curso_id=$1 and valoracion_docente <> 0')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    update: args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.matriculas SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    valoracionCurso: args => {
      const {curso_id, alumno_id, valoracion_curso} = args

      const query = pgp.as.format(`UPDATE itec.matriculas SET valoracion_curso=$3, vc_mensaje=$4 WHERE curso_id=$1 AND alumno_id=$2 RETURNING *`)
      const values = [
        valoracion_curso,
        args.vc_mensaje ? args.vc_mensaje : '',
        curso_id,
        alumno_id
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    valoracionDocente: args => {
      const {curso_id, alumno_id, valoracion_docente} = args

      const query = pgp.as.format(`UPDATE itec.matriculas SET valoracion_docente=$3, vd_mensaje=$4 WHERE curso_id=$1 AND alumno_id=$2 RETURNING *`)
      const values = [
        valoracion_docente,
        args.vd_mensaje ? args.vd_mensaje : '',
        curso_id,
        alumno_id
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.matriculas SET deleted_at=$2 WHERE id=$1 RETURNING *`)
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  })
}