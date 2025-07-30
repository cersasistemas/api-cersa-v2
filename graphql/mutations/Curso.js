const {GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLBoolean} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {ApolloError} = require('apollo-server-express')

const {CursoType} = require("../type")
const {fields} = require("../../scripts/utils")
const CursoMysql = require("../modelsMysql/Curso")

module.exports = {
  createCurso: {
    type: CursoType,
    description: "Inserta un nuevo Curso",
    args: {
      nombre_corto: {type: GraphQLNonNull(GraphQLString)},
      nombre_completo: {type: GraphQLNonNull(GraphQLString)},
      subcategoria_id: {type: GraphQLNonNull(GraphQLInt)},
      precio_virtual_asesoramiento: {type: GraphQLNonNull(GraphQLFloat)},
      precio_carrito: {type: GraphQLNonNull(GraphQLFloat)},
      precio_suficiencia: {type: GraphQLNonNull(GraphQLFloat)},
      docente_id: {type: GraphQLNonNull(GraphQLInt)},
      horas_pedagogicas: {type: GraphQLNonNull(GraphQLInt)},
      fecha_inicio: {type: GraphQLNonNull(GraphQLString)},
      sesiones: {type: GraphQLNonNull(GraphQLInt)},
      duracion: {type: GraphQLNonNull(GraphQLString)},
      modalidad_id: {type: GraphQLNonNull(GraphQLInt)},
      certificacion_horas: {type: GraphQLNonNull(GraphQLInt)},
      presentacion: {type: GraphQLNonNull(GraphQLString)},
      temario: {type: GraphQLNonNull(GraphQLString)},
      beneficios: {type: GraphQLNonNull(GraphQLString)},
      horario: {type: GraphQLNonNull(GraphQLString)},
      profesor: {type: GraphQLNonNull(GraphQLString)},
      certificacion: {type: GraphQLNonNull(GraphQLString)},
      inversion: {type: GraphQLNonNull(GraphQLString)},
      imagen: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, args, {models}) {
      // let curso = await CursoMysql.create(args)

      // curso = await models.Curso.create({...args, curso_mysql: curso.insertId})
      curso = await models.Curso.create({...args})

      await models.Modulo.create({curso_id: curso.id, nombre: "MULTIMEDIA"})
      await models.Modulo.create({curso_id: curso.id, nombre: "RECURSOS"})

      return curso
    },
  },
  updateCurso: {
    type: CursoType,
    description: "Actualiza un Curso por id",
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
      update: {type: GraphQLNonNull(GraphQLJSON)},
      isDna: {type: GraphQLNonNull(GraphQLBoolean)},
      isModulos: {type: GraphQLNonNull(GraphQLBoolean)},
      estadoPrev: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, args, {models}) {
      if (args.isDna) {
        const curso = await models.Curso.create(args.update)

        await models.Curso.update({id: args.id, update: {estado: args.estadoPrev}})

        if (args.isModulos) {
          const modulos = await models.Modulo.getAllByCursoId(args.id)

          for (modulo of modulos) {
            const newModulo = await models.Modulo.create({curso_id: curso.id, nombre: modulo.nombre})

            const archivos = await models.Archivo.getAllByModuloId(modulo.id)

            for (archivo of archivos)
              await models.Archivo.create({...archivo, modulo_id: newModulo.id})
          }
        }

        if (!args.isModulos)
          await models.Modulo.create({curso_id: curso.id, nombre: "RECURSOS"});
      } else {
        const errors = fields(CursoType.getFields(), args.update);

        if (errors.length > 0)
          throw new ApolloError("Campos incorrectos", "NOTFOUND", errors);

        await models.Curso.update(args);
      }

      return models.Curso.getById(args.id)
    },
  },
  deleteCurso: {
    type: CursoType,
    description: "Elimina un Curso por id",
    args: {
      id: {type: GraphQLNonNull(GraphQLInt)},
    },
    resolve(parent, {id}, {models}) {
      return models.Curso.delete(id);
    },
  },
};
