const {db, pgp} = require("../../scripts/pgAdaptor")

module.exports = {
  generateReporteModel: user => ({
    matriculasByFecha: (fecha_inicio, fecha_fin, fechas_id) => {
      let query
      if (fechas_id === 'created_at')
        query = pgp.as.format(`select c.nombre_completo                                     as curso,
       concat(a.nombres, ' ', a.a_paterno, ' ', a.a_materno) as alumno,
       m.created_at                                          as fecha_registro,
       m.fecha_pago                                          as fecha_pago,
       m.pago                                                as monto,
       m.descuento                                           as descuento,
       concat(u.nombres, ' ', u.a_paterno, ' ', u.a_materno) as usuario
from itec.matriculas as m
         join itec.cursos c on c.id = m.curso_id
         join itec.alumnos a on a.id = m.alumno_id
         join itec.users u on u.id = m.user_id
where m.created_at >=$1
  and m.created_at <$2
  and m.deleted_at is null
order by m.created_at asc`)
      else
        query = pgp.as.format(`select c.nombre_completo                                     as curso,
       concat(a.nombres, ' ', a.a_paterno, ' ', a.a_materno) as alumno,
       m.created_at                                          as fecha_registro,
       m.fecha_pago                                          as fecha_pago,
       m.pago                                                as monto,
       m.descuento                                           as descuento,
       concat(u.nombres, ' ', u.a_paterno, ' ', u.a_materno) as usuario
from itec.matriculas as m
         join itec.cursos c on c.id = m.curso_id
         join itec.alumnos a on a.id = m.alumno_id
         join itec.users u on u.id = m.user_id
where m.fecha_pago >=$1
  and m.fecha_pago <=$2
  and m.deleted_at is null
order by m.fecha_pago asc`)

      return db.manyOrNone(query, [fecha_inicio, `${fecha_fin} 23:59:59`]).then(res => res).catch(err => err)
    },
    matriculasByFechaUser: (fecha_inicio, fecha_fin, user_id, fechas_id) => {
      let query
      if (fechas_id === 'created_at')
        query = pgp.as.format(`select c.nombre_completo                                     as curso,
       concat(a.nombres, ' ', a.a_paterno, ' ', a.a_materno) as alumno,
       m.created_at                                          as fecha_registro,
       m.fecha_pago                                          as fecha_pago,
       m.pago                                                as monto,
       m.descuento                                           as descuento,
       concat(u.nombres, ' ', u.a_paterno, ' ', u.a_materno) as usuario
from itec.matriculas as m
         join itec.cursos c on c.id = m.curso_id
         join itec.alumnos a on a.id = m.alumno_id
         join itec.users u on u.id = m.user_id
where m.created_at >=$1
  and m.created_at <$2
  and m.user_id =$3
  and m.deleted_at is null
order by m.created_at asc`)
      else
        query = pgp.as.format(`select c.nombre_completo                                     as curso,
       concat(a.nombres, ' ', a.a_paterno, ' ', a.a_materno) as alumno,
       m.created_at                                          as fecha_registro,
       m.fecha_pago                                          as fecha_pago,
       m.pago                                                as monto,
       m.descuento                                           as descuento,
       concat(u.nombres, ' ', u.a_paterno, ' ', u.a_materno) as usuario
from itec.matriculas as m
         join itec.cursos c on c.id = m.curso_id
         join itec.alumnos a on a.id = m.alumno_id
         join itec.users u on u.id = m.user_id
where m.fecha_pago >=$1
  and m.fecha_pago <=$2
  and m.user_id =$3
  and m.deleted_at is null
order by m.fecha_pago asc`)

      return db.manyOrNone(query, [fecha_inicio, `${fecha_fin} 23:59:59`, user_id]).then(res => res).catch(err => err)
    },
    matriculasByFechaCurso: (fecha_inicio, fecha_fin, cursos_id, fechas_id) => {
      let query
      if (fechas_id === 'created_at')
        query = pgp.as.format(`select c.nombre_completo                                     as curso,
       concat(a.nombres, ' ', a.a_paterno, ' ', a.a_materno) as alumno,
       m.created_at                                          as fecha_registro,
       m.fecha_pago                                          as fecha_pago,
       m.pago                                                as monto,
       m.descuento                                           as descuento,
       concat(u.nombres, ' ', u.a_paterno, ' ', u.a_materno) as usuario
from itec.matriculas as m
         join itec.cursos c on c.id = m.curso_id
         join itec.alumnos a on a.id = m.alumno_id
         join itec.users u on u.id = m.user_id
where m.created_at >=$1
  and m.created_at <$2
  and m.curso_id IN ${pgp.helpers.values(Object.assign({}, cursos_id))}
  and m.deleted_at is null
order by m.created_at asc`)
      else
        query = pgp.as.format(`select c.nombre_completo                                     as curso,
       concat(a.nombres, ' ', a.a_paterno, ' ', a.a_materno) as alumno,
       m.created_at                                          as fecha_registro,
       m.fecha_pago                                          as fecha_pago,
       m.pago                                                as monto,
       m.descuento                                           as descuento,
       concat(u.nombres, ' ', u.a_paterno, ' ', u.a_materno) as usuario
from itec.matriculas as m
         join itec.cursos c on c.id = m.curso_id
         join itec.alumnos a on a.id = m.alumno_id
         join itec.users u on u.id = m.user_id
where m.fecha_pago >=$1
  and m.fecha_pago <=$2
  and m.curso_id IN ${pgp.helpers.values(Object.assign({}, cursos_id))}
  and m.deleted_at is null
order by m.fecha_pago asc`)

      return db.manyOrNone(query, [fecha_inicio, `${fecha_fin} 23:59:59`]).then(res => res).catch(err => err)
    }
,
    matriculasByFechaUserCurso: (fecha_inicio, fecha_fin, user_id, cursos_id, fechas_id) => {
      let query
      if (fechas_id === 'created_at')
        query = pgp.as.format(
`select c.nombre_completo                                     as curso,
concat(a.nombres, ' ', a.a_paterno, ' ', a.a_materno) as alumno,
m.created_at                                          as fecha_registro,
m.fecha_pago                                          as fecha_pago,
m.pago                                                as monto,
m.descuento                                           as descuento,
concat(u.nombres, ' ', u.a_paterno, ' ', u.a_materno) as usuario
from itec.matriculas as m
join itec.cursos c on c.id = m.curso_id
join itec.alumnos a on a.id = m.alumno_id
join itec.users u on u.id = m.user_id
where m.created_at >=$1
and m.created_at <$2
and m.user_id =$3
and m.curso_id IN ${pgp.helpers.values(Object.assign({}, cursos_id))}
and m.deleted_at is null
order by m.created_at asc`
)
      else
        query = pgp.as.format(
`select c.nombre_completo                                     as curso,
concat(a.nombres, ' ', a.a_paterno, ' ', a.a_materno) as alumno,
m.created_at                                          as fecha_registro,
m.fecha_pago                                          as fecha_pago,
m.pago                                                as monto,
m.descuento                                           as descuento,
concat(u.nombres, ' ', u.a_paterno, ' ', u.a_materno) as usuario
from itec.matriculas as m
join itec.cursos c on c.id = m.curso_id
join itec.alumnos a on a.id = m.alumno_id
join itec.users u on u.id = m.user_id
where m.fecha_pago >=$1
and m.fecha_pago <=$2
and m.user_id =$3
and m.curso_id IN ${pgp.helpers.values(Object.assign({}, cursos_id))}
and m.deleted_at is null
order by m.fecha_pago asc`)

return db.manyOrNone(query, [fecha_inicio, `${fecha_fin} 23:59:59`, user_id]).then(res => res).catch(err => err)
}
})
}