const {GraphQLObjectType, GraphQLSchema} = require("graphql")

const {login, refresh, reset, verify} = require("./queries/Auth")
const {users, user} = require("./queries/User")
const {cursos, curso, cursosActivos, cursosDesactivados, cursoMysql} = require("./queries/Curso")
const {categorias, categoria} = require("./queries/Categoria")
const {modalidades, modalidad} = require("./queries/Modalidad")
const {docentes, docente} = require("./queries/Docente")
const {modulos, modulosByCursoId, modulo} = require("./queries/Modulo")
const {archivos, archivosByModuloId, archivo, archivosByCursoId} = require("./queries/Archivo")
const {alumnos, alumno, alumnoByEmail} = require("./queries/Alumno")
const {
  matriculas,
  matriculasByCursoId,
  matricula,
  matriculasByAlumnoIdEstado,
  matriculasByCursoIdGroup,
  matriculasByCursoIdGroupImporte,
  matriculasByCursosAlumnos,
  matriculasByCursosImporte,
  matriculasPendientes
} = require("./queries/Matricula")
const {promociones, promocion} = require("./queries/Promocion")
const {sesiones, sesion} = require("./queries/Sesion")
const {apirest} = require("./queries/Api")
const {roles, role} = require("./queries/Role")
const {permissions} = require("./queries/Permission")
const {notifications, notification, notificationByDeviceId} = require("./queries/Notification")
const {devices, device} = require("./queries/Device")
const {subcategorias, subcategoria, subcategoriasByCategoriaId} = require("./queries/Subcategoria")
const {comments, comment, commentsMobil} = require("./queries/Comment")
const {packs, pack, packMatricular, packsPendientes} = require("./queries/Pack")
const {marcador} = require("./queries/Marcador")
const {reproduccion} = require("./queries/Reproduccion")
const {asistencia} = require("./queries/Asistencia")
const {certificados, certificadoById, certificadoByCodigo, createPdf} = require("./queries/Certificado")
const {matriculasByFechaUserCurso, createExcelVentas, createExcelMatriculas} = require("./queries/Reporte")

const {createCurso, updateCurso, deleteCurso} = require("./mutations/Curso")
const {createCategoria, updateCategoria, deleteCategoria} = require("./mutations/Categoria")
const {createModulo, updateModulo, deleteModulo} = require("./mutations/Modulo")
const {createDocente, updateDocente, deleteDocente} = require("./mutations/Docente")
const {createAlumno, updateAlumno, deleteAlumno, uploadImage} = require("./mutations/Alumno")
const {
  createMatricula,
  updateMatricula,
  deleteMatricula,
  updateValoracionCurso,
  updateValoracionDocente
} = require("./mutations/Matricula")
const {createPromocion, updatePromocion, deletePromocion} = require("./mutations/Promocion")
const {createPromocionHasCursos, deletePromocionHasCursos} = require("./mutations/PromocionHasCursos")
const {createSesion, updateSesion, deleteSesion} = require("./mutations/Sesion")
const {deleteSesionDia} = require("./mutations/SesionDias")
const {createRole, updateRole, deleteRole} = require("./mutations/Role")
const {createArchivo, updateArchivo, deleteArchivo} = require("./mutations/Archivo")
const {createUser, updateUser, deleteUser} = require("./mutations/User")
const {passwordReset, emailConfirmation} = require("./mutations/Auth")
const {
  createNotification,
  updateNotification,
  readNotification,
  deleteNotification,
  sendNotification
} = require("./mutations/Notification")
const {createNotificationHasCursos, deleteNotificationHasCursos} = require("./mutations/NotificationHasCursos")
const {createDevice, updateDevice, deleteDevice} = require("./mutations/Device")
const {createSubcategoria, updateSubcategoria, deleteSubcategoria} = require("./mutations/Subcategoria")
const {createComment, updateComment, deleteComment} = require("./mutations/Comment")
const {createPack, updatePack, deletePack} = require("./mutations/Pack")
const {createMarcador, updateMarcador, deleteMarcador} = require("./mutations/Marcador")
const {createReproduccion} = require("./mutations/Reproduccion")
const {createAsistencia, deleteAsistencia} = require("./mutations/Asistencia")
const {createCertificado, updateCertificado, deleteCertificado} = require("./mutations/Certificado")

const {newComment} = require("./subscriptions/Comment")
const {newPendiente} = require("./subscriptions/Matricula")
const {newPackPendiente} = require("./subscriptions/Pack")

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQueryType",
    type: "Query",
    description: 'All Queries',
    fields: {
      // API
      apirest,
      // Auth
      login, refresh, reset, verify,
      // User
      users, user,
      // Curso
      cursos, curso, cursosActivos, cursosDesactivados, cursoMysql,
      // Categoria
      categorias, categoria,
      // Modalidad
      modalidades, modalidad,
      // Docente
      docentes, docente,
      // Modulo
      modulos, modulosByCursoId, modulo,
      // Archivo
      archivos, archivosByModuloId, archivo, archivosByCursoId,
      // Alumno
      alumnos, alumno, alumnoByEmail,
      // Matricula
      matriculas, matriculasByCursoId, matricula, matriculasByAlumnoIdEstado, matriculasByCursoIdGroup,
      matriculasByCursoIdGroupImporte, matriculasByCursosAlumnos, matriculasByCursosImporte, matriculasPendientes,
      // Promoción
      promociones, promocion,
      // Sesión
      sesiones, sesion,
      // Role
      roles, role,
      // Permissions
      permissions,
      // Notification
      notifications, notification, notificationByDeviceId,
      // Device
      devices, device,
      // Subcategoria
      subcategorias, subcategoria, subcategoriasByCategoriaId,
      // Comment
      comments, comment, commentsMobil,
      // Pack
      packs, pack, packMatricular, packsPendientes,
      // Marcador
      marcador,
      // Reproduccion
      reproduccion,
      // Asistencia
      asistencia,
      // Certificado
      certificados, certificadoById, certificadoByCodigo, createPdf,
      // Reporte
      matriculasByFechaUserCurso, createExcelVentas, createExcelMatriculas
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    type: "Mutation",
    description: 'All Mutations',
    fields: {
      // Curso
      createCurso, updateCurso, deleteCurso,
      // Categoria
      createCategoria, updateCategoria, deleteCategoria,
      // Modulo
      createModulo, updateModulo, deleteModulo,
      // Docente
      createDocente, updateDocente, deleteDocente,
      // Alumno
      createAlumno, updateAlumno, deleteAlumno, uploadImage,
      // Matricula
      createMatricula, updateMatricula, deleteMatricula, updateValoracionCurso, updateValoracionDocente,
      // Promoción
      createPromocion, updatePromocion, deletePromocion,
      // Promocion Has Cursos
      createPromocionHasCursos, deletePromocionHasCursos,
      // Sesión
      createSesion, updateSesion, deleteSesion,
      // Sesión Día
      deleteSesionDia,
      // Role
      createRole, updateRole, deleteRole,
      // Archivo
      createArchivo, updateArchivo, deleteArchivo,
      // User
      createUser, updateUser, deleteUser,
      // Auth
      passwordReset, emailConfirmation,
      // Notification
      createNotification, updateNotification, readNotification, deleteNotification, sendNotification,
      // Notification Has Cursos
      createNotificationHasCursos, deleteNotificationHasCursos,
      // Device
      createDevice, updateDevice, deleteDevice,
      // Subcategoria
      createSubcategoria, updateSubcategoria, deleteSubcategoria,
      // Comment
      createComment, updateComment, deleteComment,
      // Pack
      createPack, updatePack, deletePack,
      // Marcador
      createMarcador, updateMarcador, deleteMarcador,
      // Reproduccion
      createReproduccion,
      // Asistencia
      createAsistencia, deleteAsistencia,
      // Certificado
      createCertificado, updateCertificado, deleteCertificado
    }
  }),

  subscription: new GraphQLObjectType({
    name: "RootSubscriptionType",
    type: "Subscription",
    fields: {
      // Comment
      newComment,
      // Matricula
      newPendiente,
      // Pack
      newPackPendiente
    }
  })
})