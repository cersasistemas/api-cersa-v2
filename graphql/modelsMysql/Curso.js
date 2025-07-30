const db = require("../../scripts/mysql")

module.exports = {
  create: async ({nombre_corto, nombre_completo, subcategoria_id, precio_virtual_asesoramiento, precio_carrito, precio_suficiencia, docente_id, horas_pedagogicas, fecha_inicio, sesiones, duracion, modalidad_id, certificacion_horas, presentacion, temario, beneficios, horario, profesor, certificacion, inversion, imagen}) => {

    const values = {
      category: 8,
      sortorder: 0,
      fullname: nombre_completo,
      shortname: nombre_corto,
      idnumber: '',
      summary: '',
      summaryformat: 1,
      format: 'topics',
      showgrades: 0,
      newsitems: 5,
      startdate: 0,
      enddate: 0,
      marker: 0,
      maxbytes: 0,
      legacyfiles: 0,
      showreports: 0,
      visible: 1,
      visibleold: 1,
      groupmode: 0,
      groupmodeforce: 0,
      defaultgroupingid: 0,
      lang: '',
      calendartype: '',
      theme: '',
      timecreated: 0,
      timemodified: 0,
      requested: 0,
      enablecompletion: 0,
      completionnotify: 0,
      cacherev: 0
    }

    return db.many('INSERT INTO mdl_course SET ?', values)
  }
}