const db = require("../../scripts/mysql")

module.exports = {
  create: async ({
                   curso_id,
                   alumno_id,
                   pago,
                   descuento,
                   fecha_pago,
                   nuevo,
                   voucher,
                   descripcion,
                   estado,
                   curso_mysql,
                   alumno_mysql
                 }) => {

    let values = {
      enrol: 'manual',
      status: 0,
      courseid: curso_mysql,
      sortorder: 0,
      name: null,
      enrolperiod: 0,
      enrolstartdate: 0,
      enrolenddate: 0,
      expirynotify: 0,
      expirythreshold: 0,
      notifyall: 0,
      password: null,
      cost: null,
      currency: null,
      roleid: 5,
      customint1: null,
      customint2: null,
      customint3: null,
      customint4: null,
      customint5: null,
      customint6: null,
      customint7: null,
      customint8: null,
      customchar1: null,
      customchar2: null,
      customchar3: null,
      customdec1: null,
      customdec2: null,
      customtext1: null,
      customtext2: null,
      customtext3: null,
      customtext4: null,
      timecreated: 0,
      timemodified: 0
    }

    let matricula = await db.many('INSERT INTO mdl_enrol SET ?', values)

    values = {
      status: 0,
      enrolid: matricula.insertId,
      userid: alumno_mysql,
      timestart: 0,
      timeend: 0,
      modifierid: 0,
      timecreated: 0,
      timemodified: 0
    }

    return db.many('INSERT INTO mdl_user_enrolments SET ?', values)
  },
  delete: matricula_id => db.many('DELETE FROM mdl_user_enrolments WHERE ?', {id: matricula_id})
}