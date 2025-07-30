const {GraphQLNonNull, GraphQLString, GraphQLInt} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')
const {GraphQLUpload} = require('graphql-upload')

const {AlumnoType, FileType} = require("../type")
const {fields} = require("../../scripts/utils")
const AlumnoMysql = require("../modelsMysql/Alumno")
const sendEmail = require("../../scripts/email")
const {passwordHash} = require("../../scripts/utils")

module.exports = {
    createAlumno: {
        type: AlumnoType,
        description: 'Inserta un nuevo Alumno',
        args: {
            siglas: {type: GraphQLString},
            nombres: {type: GraphQLNonNull(GraphQLString)},
            a_paterno: {type: GraphQLNonNull(GraphQLString)},
            a_materno: {type: GraphQLNonNull(GraphQLString)},
            nacimiento: {type: GraphQLString},
            dni: {type: GraphQLString},
            celular: {type: GraphQLString},
            avatar: {type: GraphQLString},
            direccion: {type: GraphQLString},
            departamento: {type: GraphQLString},
            provincia: {type: GraphQLString},
            distrito: {type: GraphQLString},
            profesion: {type: GraphQLString},
            email: {type: GraphQLNonNull(GraphQLString)},
            password: {type: GraphQLNonNull(GraphQLString)},
            password_f: {type: GraphQLString},
            password_g: {type: GraphQLString},
            pais: {type: GraphQLNonNull(GraphQLString)}
        },
        async resolve(parent, args, {user, models}) {
            args.email = args.email.toLowerCase()
            // let alumno = await AlumnoMysql.getByEmail(args.email.toLowerCase())

            // if (!alumno) {
            //     alumno = await AlumnoMysql.create(args)
            //     alumno.mysl = alumno.insertId
            // } else
            //     alumno.mysl = alumno.id

            let myAlumno = await models.Alumno.getByEmail(args.email)
            if (!myAlumno) {
                // myAlumno = await models.Alumno.create({...args, alumno_mysql: alumno.mysl})
                myAlumno = await models.Alumno.create({...args})
                user.email = args.email
                await sendEmail({
                    user, tipo: 'register', alumno: {
                        ...myAlumno,
                        password: args.password ? args.password : args.dni
                    }
                })
            }

            return myAlumno
        }
    },
updateAlumno: {
        type: AlumnoType,
        description: 'Actualiza un Alumno por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)},
            update: {type: GraphQLNonNull(GraphQLJSON)}
        },
        async resolve(parent, args, {user, models}) {
            const errors = fields(AlumnoType.getFields(), args.update)

            if (errors.length > 0)
                throw new ApolloError('Campos incorrectos', 'NOTFOUND', errors)

            args.update.email = args.update.email.toLowerCase()
            let myAlumno = await models.Alumno.getByEmail(args.update.email)
            myAlumno = myAlumno ? myAlumno : {id: args.id}

            if (Number(myAlumno.id) !== args.id)
                return null

            const passwordText = args.update.password
            const password = args.update.password !== '' && args.update.password ? await passwordHash(args.update.password) : ''
            if (password !== '') {
                args.update.password = password

                const alumno = await models.Alumno.getById(args.id)
                // const ua = await AlumnoMysql.update({
                //     email: args.update.email,
                //     password: args.update.password,
                //     id: alumno.alumno_mysql
                // })
                // if (ua.insertId === undefined)
                //     return {
                //         id: null
                //     }
                user.email = args.update.email
                await sendEmail({
                    user, tipo: 'register', alumno: {
                        ...alumno,
                        password: passwordText,
                        email: args.update.email
                    }
                })
            } else
                delete args.update.password

            return models.Alumno.update(args)
        }
    },
    deleteAlumno: {
        type: AlumnoType,
        description: 'Elimina un Alumno por id',
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, {id}, {models}) {

            return models.Alumno.delete(id)
        }
    },
    uploadImage: {
        description: 'Uploads an image.',
        type: FileType,
        args: {
            image: {type: GraphQLUpload}
        },
        async resolve(parent, {image}, {user}) {
            console.log(user)
            const {filename, mimetype, createReadStream} = await image
            const stream = createReadStream()
            // Promisify the stream and store the file, then…
            return {
                filename
            }
        },
    }
}

