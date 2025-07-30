const moment = require('moment')

const {db, pgp} = require("../../scripts/pgAdaptor")
const {update, timestamp} = require("../../scripts/utils")

module.exports = {
  generateCursoModel: user => ({
    create: ({nombre_corto, nombre_completo, subcategoria_id, precio_virtual_asesoramiento, precio_carrito, precio_suficiencia, docente_id, horas_pedagogicas, fecha_inicio, sesiones, duracion, modalidad_id, certificacion_horas, presentacion, temario, beneficios, horario, profesor, certificacion, inversion, imagen, curso_mysql}) => {
      const query = pgp.as.format('INSERT INTO itec.cursos(nombre_corto, nombre_completo, subcategoria_id, precio_virtual_asesoramiento, precio_carrito, precio_suficiencia, docente_id, horas_pedagogicas, fecha_inicio, sesiones, duracion, modalidad_id, certificacion_horas, presentacion, temario, beneficios, horario, profesor, certificacion, inversion, imagen, estado, created_at, updated_at, curso_mysql) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) RETURNING *')

      const values = [
        nombre_corto,
        nombre_completo,
        subcategoria_id,
        precio_virtual_asesoramiento,
        precio_carrito,
        precio_suficiencia,
        docente_id,
        horas_pedagogicas,
        fecha_inicio,
        sesiones,
        duracion,
        modalidad_id,
        certificacion_horas,
        presentacion,
        temario,
        beneficios,
        horario,
        profesor,
        certificacion,
        inversion,
        imagen,
        modalidad_id,
        timestamp(),
        timestamp(),
        curso_mysql
      ];

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    getAll: () => {
      const query = pgp.as.format('SELECT * FROM itec.cursos WHERE deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query).then(res => res).catch(err => err)
    },
    getAllActivos: () => {
      const query = pgp.as.format('SELECT * FROM itec.cursos WHERE estado<>$1 AND deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query, ['3']).then(res => res).catch(err => err)
    },
    getAllDesactivados: () => {
      const query = pgp.as.format('SELECT * FROM itec.cursos WHERE estado=$1 AND deleted_at is NULL ORDER BY id DESC')

      return db.manyOrNone(query, ['3']).then(res => res).catch(err => err)
    },
    getByPromocionId: promocion_id => {
      const query = pgp.as.format('select * from itec.cursos as c inner join itec.promocion_has_cursos as pc on c.id = pc.curso_id where pc.promocion_id=$1 and pc.deleted_at is null')

      return db.manyOrNone(query, [promocion_id]).then(res => res).catch(err => err)
    },
    getBySubategoriaId: subcategoria_id => {
      const query = pgp.as.format('SELECT * FROM itec.cursos where subcategoria_id=$1 and deleted_at is NULL')

      return db.manyOrNone(query, [subcategoria_id]).then(res => res).catch(err => err)
    },
    getBySubategoriaIdActivos: subcategoria_id => {
      const query = pgp.as.format('SELECT * FROM itec.cursos where subcategoria_id=$1 AND estado<>$2 and deleted_at is NULL')

      return db.manyOrNone(query, [subcategoria_id, '3']).then(res => res).catch(err => err)
    },
    getBySubategoriaIdFormMovil: subcategoria_id => {
      const query = pgp.as.format('SELECT * FROM itec.cursos where subcategoria_id=$1 and deleted_at is NULL and estado<>$2 ORDER BY id DESC')

      return db.manyOrNone(query, [subcategoria_id, '3']).then(res => res).catch(err => err)
    },
    getByAlumnoIdAndEstado: (alumno_id, estado) => {
      const query = pgp.as.format('SELECT c.* FROM cersa.itec.alumnos as a inner join cersa.itec.matriculas as m on a.id = m.alumno_id inner join cersa.itec.cursos as c on m.curso_id = c.id where a.id=$1 and m.estado=$2 and m.deleted_at is NULL')

      return db.manyOrNone(query, [alumno_id, estado]).then(res => res).catch(err => err)
    },
    getByAlumnoId: categoria_id => {
      const query = pgp.as.format('SELECT c.* FROM cersa.itec.alumnos as a inner join cersa.itec.matriculas as m on a.id = m.alumno_id inner join cersa.itec.cursos as c on m.curso_id = c.id where a.id=$1 and m.deleted_at is NULL')

      return db.manyOrNone(query, [categoria_id]).then(res => res).catch(err => err)
    },
    getById: id => {
      const query = pgp.as.format('SELECT * FROM itec.cursos where id=$1')

      return db.oneOrNone(query, [id]).then(res => res).catch(err => err)
    },
    getByMysqlId: mysql_id => {
      const query = pgp.as.format('SELECT * FROM itec.cursos where curso_mysql=$1 AND deleted_at is NULL')

      return db.oneOrNone(query, [mysql_id]).then(res => res).catch(err => err)
    },
    update: args => {
      const {set, values} = update(args)

      const query = pgp.as.format(`UPDATE itec.cursos SET ${set} WHERE id=$1 RETURNING *`)

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    },
    delete: id => {
      const query = pgp.as.format(`UPDATE itec.cursos SET deleted_at=$2 WHERE id=$1 RETURNING *`)
      const values = [
        id,
        timestamp()
      ]

      return db.oneOrNone(query, values).then(res => res).catch(err => err)
    }
  }),
}