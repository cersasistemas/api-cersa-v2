const {GraphQLNonNull, GraphQLInt, GraphQLString} = require("graphql")

const {PromocionHasCursosType} = require("../type")

module.exports = {
  createPromocionHasCursos: {
    type: PromocionHasCursosType,
    description: 'Inserta un nuevo Modulo',
    args: {
      promocion_id: {type: GraphQLNonNull(GraphQLInt)},
      curso_id: {type: GraphQLNonNull(GraphQLInt)},
      type: {type: GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent, args, {models}) {
      let promocion = {}
      switch (args.type) {
        case 'subcategorias':
          const cursos = await models.Curso.getBySubategoriaIdActivos(args.curso_id);

          for (const curso of cursos) {
            promocion = await models.PromocionHasCursos.getByPromocionIdCursoId(args.promocion_id, curso.id)
            args.curso_id = curso.id
            if (promocion === null)
              promocion = await models.PromocionHasCursos.create({
                promocion_id: args.promocion_id,
                curso_id: curso.id
              })
          }
          break
        case 'cursos':
          promocion = await models.PromocionHasCursos.getByPromocionIdCursoId(args.promocion_id, args.curso_id)
          if (promocion === null)
            promocion = await models.PromocionHasCursos.create(args)
          break
      }

      return models.PromocionHasCursos.getByPromocionIdCursoId(args.promocion_id, args.curso_id)
    }
  },
  deletePromocionHasCursos: {
    type: PromocionHasCursosType,
    description: 'Elimina un Modulo por id',
    args: {
      promocion_id: {type: GraphQLNonNull(GraphQLInt)},
      curso_id: {type: GraphQLNonNull(GraphQLInt)}
    },
    resolve(parent, {promocion_id, curso_id}, {models}) {

      return models.PromocionHasCursos.delete(promocion_id, curso_id)
    }
  }
}