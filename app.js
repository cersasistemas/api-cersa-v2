const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fileUpload = require('express-fileupload')
const cors = require("cors")
const {createServer} = require('http')
const {ApolloServer, AuthenticationError} = require('apollo-server-express')
const https = require('https')
const fs = require('fs')

require('dotenv').config()

const indexRouter = require('./routes/index')
const uploadRouter = require('./routes/upload')
const downloadRouter = require('./routes/download')
const downloadMatriculaRouter = require('./routes/downloadMatricula')
const schema = require("./graphql/schema")
const {getUser} = require("./scripts/isAuth")
const {
  generateUserModel, generateCursoModel, generateCategoriaModel, generateModalidadModel, generateDocenteModel,
  generateModuloModel, generateArchivoModel, generateAlumnoModel, generateMatriculaModel, generatePromocionModel,
  generatePromocionHasCursosModel, generateSesionModel, generateRoleModel, generatePermissionModel,
  generateRoleHasPermissionModel, generateNotificationModel, generateNotificationHasCursosModel, generateDeviceModel,
  generateSesionDiasModel, generateSubcategoriaModel, generateCommentModel, generateLikeModel, generatePackModel,
  generateDetallePackModel, generateMarcadorModel, generateReproduccionModel, generateAsistenciaModel,
  generateCertificadoModel, generateReporteModel
} = require("./graphql/models")

require('dotenv').config()

const app = express()

const whitelist = [process.env.CERSA_WEB, process.env.TEST]

app.use(fileUpload({
  createParentPath: true
}))

app.use(cors({
  origin: '*'
  // origin: function (origin, callback) {
  //     if (whitelist.indexOf(origin) !== -1 || !origin)
  //         callback(null, true)
  //     else
  //         callback(new Error('Not allowed by CORS'))
  // }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/upload', uploadRouter)
app.use('/download', downloadRouter)
app.use('/downloadMatricula', downloadMatriculaRouter)
const server = new ApolloServer({
  schema,
  context: async ({req, connection}) => {
    const token = req ? req.headers.authorization : ''
    const user = await getUser(token)
    if (!user) throw new AuthenticationError('You must be logged in')
    // add the user to the context
    return {
      user,
      models: {
        User: generateUserModel(user),
        Curso: generateCursoModel(user),
        Categoria: generateCategoriaModel(user),
        Modalidad: generateModalidadModel(user),
        Docente: generateDocenteModel(user),
        Modulo: generateModuloModel(user),
        Archivo: generateArchivoModel(user),
        Alumno: generateAlumnoModel(user),
        Matricula: generateMatriculaModel(user),
        Promocion: generatePromocionModel(user),
        PromocionHasCursos: generatePromocionHasCursosModel(user),
        Sesion: generateSesionModel(user),
        Role: generateRoleModel(user),
        Permission: generatePermissionModel(user),
        RoleHasPermission: generateRoleHasPermissionModel(user),
        Notification: generateNotificationModel(user),
        NotificationHasCurso: generateNotificationHasCursosModel(user),
        Device: generateDeviceModel(user),
        SesionDias: generateSesionDiasModel(user),
        Subcategoria: generateSubcategoriaModel(user),
        Comment: generateCommentModel(user),
        Like: generateLikeModel(user),
        Pack: generatePackModel(user),
        DetallePack: generateDetallePackModel(user),
        Marcador: generateMarcadorModel(user),
        Reproduccion: generateReproduccionModel(user),
        Asistencia: generateAsistenciaModel(user),
        Certificado: generateCertificadoModel(user),
        Reporte: generateReporteModel(user)
      }
    }
  },
  subscriptions: {
    onConnect: async (connectionParams, webSocket, context) => {
      console.log('conectado')
      const token = connectionParams ? connectionParams.headers.authorization : ''
      const user = await getUser(token)
      if (!user) throw new AuthenticationError('You must be logged in')

      return user
    },
    onDisconnect: (webSocket, context) => {
      console.log('desconectado')
    }
  },
  uploads: {
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20
  }
})
server.applyMiddleware({app, path: '/api'})

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

httpServer.listen(process.env.PORT, () => {
  console.log(`Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
  console.log(`Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`)
})

const httpsServer = https.createServer({
  key: fs.readFileSync(process.env.SRV_KEY),
  cert: fs.readFileSync(process.env.SRV_CERT)
}, app)

server.installSubscriptionHandlers(httpsServer)

httpsServer.listen(process.env.PORT_HTTPS, function () {
  console.log(`Example app listening on port ${process.env.PORT_HTTPS}! Go to https://localhost:${process.env.PORT_HTTPS}/`)
  console.log(`Example app listening on port ${process.env.PORT_HTTPS}! Go to https://localhost:${process.env.PORT_HTTPS}/`)
})

module.exports = app