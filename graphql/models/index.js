const {generateUserModel} = require("./User")
const {generateCursoModel} = require("./Curso")
const {generateCategoriaModel} = require("./Categoria")
const {generateModalidadModel} = require("./Modalidad")
const {generateDocenteModel} = require("./Docente")
const {generateModuloModel} = require("./Modulo")
const {generateArchivoModel} = require("./Archivo")
const {generateAlumnoModel} = require("./Alumno")
const {generateMatriculaModel} = require("./Matricula")
const {generatePromocionModel} = require("./Promocion")
const {generatePromocionHasCursosModel} = require("./PromocionHasCursos")
const {generateSesionModel} = require("./Sesion")
const {generateRoleModel} = require("./Role")
const {generatePermissionModel} = require("./Permission")
const {generateRoleHasPermissionModel} = require("./RoleHasPermission")
const {generateNotificationModel} = require("./Notification")
const {generateNotificationHasCursosModel} = require("./NotificationHasCursos")
const {generateDeviceModel} = require("./Device")
const {generateSesionDiasModel} = require("./SesionDias")
const {generateSubcategoriaModel} = require("./Subcategoria")
const {generateCommentModel} = require("./Comment")
const {generateLikeModel} = require("./Like")
const {generatePackModel} = require("./Pack")
const {generateDetallePackModel} = require("./DetallePack")
const {generateMarcadorModel} = require("./Marcador")
const {generateReproduccionModel} = require("./Reproduccion")
const {generateAsistenciaModel} = require("./Asistencia")
const {generateCertificadoModel} = require("./Certificado")
const {generateReporteModel} = require("./Reporte")

module.exports = {
  // User
  generateUserModel: user => generateUserModel(user),
  // Curso
  generateCursoModel: user => generateCursoModel(user),
  // Categoria
  generateCategoriaModel: user => generateCategoriaModel(user),
  // Modalidad
  generateModalidadModel: user => generateModalidadModel(user),
  // Docente
  generateDocenteModel: user => generateDocenteModel(user),
  // Docente
  generateModuloModel: user => generateModuloModel(user),
  // Archivo
  generateArchivoModel: user => generateArchivoModel(user),
  // Alumno
  generateAlumnoModel: user => generateAlumnoModel(user),
  // Matricula
  generateMatriculaModel: user => generateMatriculaModel(user),
  // Promoción
  generatePromocionModel: user => generatePromocionModel(user),
  // Promoción Has Cursos
  generatePromocionHasCursosModel: user => generatePromocionHasCursosModel(user),
  // Promoción Has Cursos
  generateSesionModel: user => generateSesionModel(user),
  // Role
  generateRoleModel: user => generateRoleModel(user),
  // Permission
  generatePermissionModel: user => generatePermissionModel(user),
  // Role Has Permission
  generateRoleHasPermissionModel: user => generateRoleHasPermissionModel(user),
  // Notification
  generateNotificationModel: user => generateNotificationModel(user),
  // Notification Has Cursos
  generateNotificationHasCursosModel: user => generateNotificationHasCursosModel(user),
  // Device
  generateDeviceModel: user => generateDeviceModel(user),
  // Sesion
  generateSesionDiasModel: user => generateSesionDiasModel(user),
  // Subcategoria
  generateSubcategoriaModel: user => generateSubcategoriaModel(user),
  // Comment
  generateCommentModel: user => generateCommentModel(user),
  // Like
  generateLikeModel: user => generateLikeModel(user),
  // Pack
  generatePackModel: user => generatePackModel(user),
  // Pack
  generateDetallePackModel: user => generateDetallePackModel(user),
  // Marcador
  generateMarcadorModel: user => generateMarcadorModel(user),
  // Reproducciones
  generateReproduccionModel: user => generateReproduccionModel(user),
  // Asistencia
  generateAsistenciaModel: user => generateAsistenciaModel(user),
  // Certificado
  generateCertificadoModel: user => generateCertificadoModel(user),
  // Reporte
  generateReporteModel: user => generateReporteModel(user)
}