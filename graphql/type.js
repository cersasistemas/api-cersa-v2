const {GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLFloat} = require("graphql")
const {GraphQLJSON} = require("graphql-type-json")
const {GraphQLDate, GraphQLDateTime} = require("graphql-iso-date")

const ApiRestType = new GraphQLObjectType({
  name: "ApiRest",
  fields: {
    success: {type: GraphQLBoolean},
    result: {type: GraphQLJSON}
  }
})

const PermissionType = new GraphQLObjectType({
  name: "Permission",
  fields: {
    id: {type: GraphQLInt},
    nombre: {type: GraphQLString},
    descripcion: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime}
  }
})

const RoleType = new GraphQLObjectType({
  name: "Role",
  fields: {
    id: {type: GraphQLInt},
    nombre: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},

    permissions: {
      type: GraphQLList(PermissionType),
      resolve({id}, args, {models}) {

        return models.RoleHasPermission.getPermissionsByRole(id)
      }
    },
  }
})

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: {type: GraphQLInt},
    email: {type: GraphQLString},
    nombres: {type: GraphQLString},
    a_paterno: {type: GraphQLString},
    a_materno: {type: GraphQLString},
    avatar: {type: GraphQLString},
    password: {type: GraphQLString},
    email_verified_at: {type: GraphQLDateTime},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    role_id: {type: GraphQLInt},

    authentication: {type: GraphQLString},
    authorization: {type: GraphQLJSON},
    permissions: {type: GraphQLJSON},

    role: {
      type: RoleType,
      resolve({role_id}, args, {models}) {

        return models.Role.getById(role_id)
      }
    },
  }
})

const ModalidadType = new GraphQLObjectType({
  name: "Modalidad",
  fields: {
    id: {type: GraphQLInt},
    nombre: {type: GraphQLString},
    descripcion: {type: GraphQLString},
    created_at: {type: GraphQLString},
    updated_at: {type: GraphQLString},
    deleted_at: {type: GraphQLString}
  }
})

const DocenteType = new GraphQLObjectType({
  name: "Docente",
  fields: {
    id: {type: GraphQLInt},
    dni: {type: GraphQLString},
    nombres: {type: GraphQLString},
    a_paterno: {type: GraphQLString},
    a_materno: {type: GraphQLString},
    avatar: {type: GraphQLString},
    descripcion: {type: GraphQLString},
    cv: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime}
  }
})

const MarcadorType = new GraphQLObjectType({
  name: "Marcador",
  fields: {
    id: {type: GraphQLInt},
    alumno_id: {type: GraphQLInt},
    archivo_id: {type: GraphQLInt},
    marker: {type: GraphQLString},
    time: {type: GraphQLInt},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
  }
})

const ReproduccionType = new GraphQLObjectType({
  name: "Reproduccion",
  fields: {
    id: {type: GraphQLInt},
    alumno_id: {type: GraphQLInt},
    archivo_id: {type: GraphQLInt},
    tiempo: {type: GraphQLInt},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime}
  }
})

const ArchivoType = new GraphQLObjectType({
  name: "Archivo",
  fields: {
    id: {type: GraphQLInt},
    modulo_id: {type: GraphQLInt},
    nombre: {type: GraphQLString},
    link: {type: GraphQLString},
    tipo: {type: GraphQLString},
    tamanio: {type: GraphQLFloat},
    calidad: {type: GraphQLString},
    duracion: {type: GraphQLFloat},
    html: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    orden: {type: GraphQLInt},
    is_public: {type: GraphQLBoolean},

    marcadores: {
      type: GraphQLList(MarcadorType),
      args: {
        alumno_id: {type: GraphQLInt}
      },
      resolve({id}, {alumno_id}, {models}) {

        return models.Marcador.getAllByAlumnoIdAndArchivoId(alumno_id, id)
      }
    },

    reproduccion: {
      type: ReproduccionType,
      args: {
        alumno_id: {type: GraphQLInt}
      },
      resolve({id}, {alumno_id}, {models}) {

        return models.Reproduccion.getByAlumnoIdArchivoId(alumno_id, id)
      }
    }
  }
})

const LikeType = new GraphQLObjectType({
  name: "Like",
  fields: {
    comentario_id: {type: GraphQLInt},
    persona_id: {type: GraphQLInt},
    model: {type: GraphQLString},
    created_at: {type: GraphQLDateTime}
  }
})

const CommentReplyType = new GraphQLObjectType({
  name: "CommentReply",
  fields: {
    id: {type: GraphQLInt},
    persona_id: {type: GraphQLInt},
    model: {type: GraphQLString},
    comentario_id: {type: GraphQLInt},
    comentario: {type: GraphQLString},
    type: {type: GraphQLString},
    archivo_id: {type: GraphQLInt},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},

    persona: {
      type: UserType,
      resolve({persona_id, model}, args, {models}) {

        return models[model].getById(persona_id)
      }
    },

    likes: {
      type: LikeType,
      resolve({comentario_id}, args, {models}) {

        return models.Like.getLikesByCommentId(comentario_id)
      }
    },

    like: {
      type: LikeType,
      resolve({comentario_id}, args, {models}) {

        return models.Like.getLikesByCommentId(comentario_id)
      }
    }
  }
})

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: {
    id: {type: GraphQLInt},
    persona_id: {type: GraphQLInt},
    model: {type: GraphQLString},
    comentario_id: {type: GraphQLInt},
    comentario: {type: GraphQLString},
    type: {type: GraphQLString},
    archivo_id: {type: GraphQLInt},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},

    persona: {
      type: UserType,
      resolve({persona_id, model}, args, {models}) {

        return models[model].getById(persona_id)
      }
    },

    comments: {
      type: GraphQLList(CommentReplyType),
      resolve({id}, args, {models}) {

        return models.Comment.getAllCommentId(id)
      }
    },

    likes: {
      type: LikeType,
      resolve({id}, args, {models}) {

        return models.Like.getLikesByCommentId(id)
      }
    }
  }
})

const ModuloType = new GraphQLObjectType({
  name: "Modulo",
  fields: {
    id: {type: GraphQLInt},
    curso_id: {type: GraphQLInt},
    nombre: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},

    archivos: {
      type: GraphQLList(ArchivoType),
      args: {
        is_public: {type: GraphQLBoolean}
      },
      async resolve({id}, {is_public}, {models}) {
        let archivos = []
        switch (is_public) {
          case true:
          case false:
            archivos = await models.Archivo.getByIsPublic(id, is_public)
            break
          default:
            archivos = await models.Archivo.getAllByModuloId(id)
            break
        }

        return archivos
      }
    }
  }
})

const PromocionReplyType = new GraphQLObjectType({
  name: "PromocionReply",
  fields: {
    id: {type: GraphQLInt},
    codigo: {type: GraphQLString},
    descuento: {type: GraphQLFloat},
    fecha_inicio: {type: GraphQLDateTime},
    fecha_fin: {type: GraphQLDateTime},
    descripcion: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
  }
})

const ValoracionType = new GraphQLObjectType({
  name: "Valoracion",
  fields: {
    valoracion_curso: {type: GraphQLInt},
    valoracion_docente: {type: GraphQLInt}
  }
})

const AsistenciaType = new GraphQLObjectType({
  name: "Asistencia",
  fields: {
    sesion_dia_id: {type: GraphQLInt},
    alumno_id: {type: GraphQLInt},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime}
  }
})

const SesionDiasType = new GraphQLObjectType({
  name: "SesionDias",
  fields: {
    id: {type: GraphQLInt},
    sesion_id: {type: GraphQLInt},
    fecha: {type: GraphQLDateTime},
    onesignal_id: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    session: {type: GraphQLBoolean},

    asistencia: {
      type: AsistenciaType,
      args: {
        alumno_id: {type: GraphQLInt}
      },
      async resolve({id}, {alumno_id}, {models}) {

        return models.Asistencia.getBySesionDiaIdAlumnoId(id, alumno_id)
      }
    }
  }
})

const SesionType = new GraphQLObjectType({
  name: "Sesion",
  fields: {
    id: {type: GraphQLInt},
    curso_id: {type: GraphQLInt},
    nombre: {type: GraphQLString},
    descripcion: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    link: {type: GraphQLString},
    password: {type: GraphQLString},
    dias: {type: GraphQLJSON},
    fecha: {type: GraphQLDateTime},
    reunion_id: {type: GraphQLString},
    recurrente: {type: GraphQLBoolean},
    recurrencia: {type: GraphQLString},
    fecha_finalizacion: {type: GraphQLDate},
    duracion: {type: GraphQLString},

    sesion_dias: {
      type: GraphQLList(SesionDiasType),
      resolve({id}, args, {models}) {

        return models.SesionDias.getAll(id)
      }
    },
    sesion_dias_activas: {
      type: GraphQLList(SesionDiasType),
      resolve({id}, args, {models}) {

        return models.SesionDias.getAllActivas(id)
      }
    }
  }
})

const CursoPreType = new GraphQLObjectType({
  name: "CursoPre",
  fields: {
    id: {type: GraphQLInt},
    nombre_corto: {type: GraphQLString},
    nombre_completo: {type: GraphQLString},
    subcategoria_id: {type: GraphQLInt},
    precio_virtual_asesoramiento: {type: GraphQLFloat},
    precio_carrito: {type: GraphQLFloat},
    precio_suficiencia: {type: GraphQLFloat},
    docente_id: {type: GraphQLInt},
    horas_pedagogicas: {type: GraphQLInt},
    fecha_inicio: {type: GraphQLDate},
    sesiones: {type: GraphQLInt},
    duracion: {type: GraphQLString},
    modalidad_id: {type: GraphQLInt},
    certificacion_horas: {type: GraphQLInt},
    presentacion: {type: GraphQLString},
    temario: {type: GraphQLString},
    beneficios: {type: GraphQLString},
    horario: {type: GraphQLString},
    profesor: {type: GraphQLString},
    certificacion: {type: GraphQLString},
    inversion: {type: GraphQLString},
    imagen: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    estado: {type: GraphQLString},

    modalidad: {
      type: ModalidadType,
      resolve({modalidad_id}, args, {models}) {

        return models.Modalidad.getById(modalidad_id)
      }
    },
    docente: {
      type: DocenteType,
      resolve({docente_id}, args, {models}) {

        return models.Docente.getById(docente_id)
      }
    },
    sessions: {
      type: GraphQLList(SesionType),
      resolve({id}, args, {models}) {

        return models.Sesion.getAll(id)
      }
    },
    modulos: {
      type: GraphQLList(ModuloType),
      resolve({id}, args, {models}) {

        return models.Modulo.getAllByCursoId(id)
      }
    },
    promociones: {
      type: GraphQLList(PromocionReplyType),
      resolve({id}, args, {models}) {

        return models.Promocion.getByCursoId(id)
      }
    },
    valoracion: {
      type: ValoracionType,
      async resolve({id}, args, {models}) {
        const vc = await models.Matricula.getValoracionCurso(id)
        const vd = await models.Matricula.getValoracionDocente(id)

        return {
          valoracion_curso: vc ? vc.valoracion_curso : 0,
          valoracion_docente: vd ? vd.valoracion_docente : 0
        }
      }
    }
  }
})

const SubcategoriaType = new GraphQLObjectType({
  name: "Subategoria",
  fields: {
    id: {type: GraphQLInt},
    categoria_id: {type: GraphQLInt},
    nombre: {type: GraphQLString},
    descripcion: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},

    cursos: {
      type: GraphQLList(CursoPreType),
      args: {
        isMovil: {type: GraphQLBoolean}
      },
      resolve({id}, {isMovil}, {models}) {
        if (isMovil)
          return models.Curso.getBySubategoriaIdFormMovil(id)

        return models.Curso.getBySubategoriaId(id)
      }
    }
  }
})

const CategoriaType = new GraphQLObjectType({
  name: "Categoria",
  fields: {
    id: {type: GraphQLInt},
    nombre: {type: GraphQLString},
    descripcion: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    icon: {type: GraphQLString},

    subcategorias: {
      type: GraphQLList(SubcategoriaType),
      resolve({id}, args, {models}) {

        return models.Subcategoria.getAllByCategoriaId(id)
      }
    }
  }
})

const CursoType = new GraphQLObjectType({
  name: "Curso",
  fields: {
    id: {type: GraphQLInt},
    nombre_corto: {type: GraphQLString},
    nombre_completo: {type: GraphQLString},
    subcategoria_id: {type: GraphQLInt},
    precio_virtual_asesoramiento: {type: GraphQLFloat},
    precio_carrito: {type: GraphQLFloat},
    precio_suficiencia: {type: GraphQLFloat},
    docente_id: {type: GraphQLInt},
    horas_pedagogicas: {type: GraphQLInt},
    fecha_inicio: {type: GraphQLDate},
    sesiones: {type: GraphQLInt},
    duracion: {type: GraphQLString},
    modalidad_id: {type: GraphQLInt},
    certificacion_horas: {type: GraphQLInt},
    presentacion: {type: GraphQLString},
    temario: {type: GraphQLString},
    beneficios: {type: GraphQLString},
    horario: {type: GraphQLString},
    profesor: {type: GraphQLString},
    certificacion: {type: GraphQLString},
    inversion: {type: GraphQLString},
    imagen: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    estado: {type: GraphQLString},

    subcategoria: {
      type: SubcategoriaType,
      resolve({subcategoria_id}, args, {models}) {

        return models.Subcategoria.getById(subcategoria_id)
      }
    },
    modalidad: {
      type: ModalidadType,
      resolve({modalidad_id}, args, {models}) {

        return models.Modalidad.getById(modalidad_id)
      }
    },
    docente: {
      type: DocenteType,
      resolve({docente_id}, args, {models}) {

        return models.Docente.getById(docente_id)
      }
    },
    sessions: {
      type: GraphQLList(SesionType),
      resolve({id}, args, {models}) {

        return models.Sesion.getAll(id)
      }
    },
    modulos: {
      type: GraphQLList(ModuloType),
      resolve({id}, args, {models}) {

        return models.Modulo.getAllByCursoId(id)
      }
    },
    modulosMultimedia: {
      type: GraphQLList(ModuloType),
      resolve({id}, args, {models}) {

        return models.Modulo.getMultimediaByCursoId(id)
      }
    },
    promociones: {
      type: GraphQLList(PromocionReplyType),
      resolve({id}, args, {models}) {

        return models.Promocion.getByCursoId(id)
      }
    },
    valoracion: {
      type: ValoracionType,
      async resolve({id}, args, {models}) {
        const vc = await models.Matricula.getValoracionCurso(id)
        const vd = await models.Matricula.getValoracionDocente(id)

        return {
          valoracion_curso: vc ? (vc.valoracion_curso ? vc.valoracion_curso : 0) : 0,
          valoracion_docente: vd ? (vd.valoracion_docente ? vd.valoracion_docente : 0) : 0
        }
      }
    }
  }
})

const AlumnoType = new GraphQLObjectType({
  name: "Alumno",
  fields: {
    id: {type: GraphQLInt},
    siglas: {type: GraphQLString},
    nombres: {type: GraphQLString},
    a_paterno: {type: GraphQLString},
    a_materno: {type: GraphQLString},
    nacimiento: {type: GraphQLDate},
    dni: {type: GraphQLString},
    celular: {type: GraphQLString},
    avatar: {type: GraphQLString},
    direccion: {type: GraphQLString},
    departamento: {type: GraphQLString},
    provincia: {type: GraphQLString},
    distrito: {type: GraphQLString},
    profesion: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    email: {type: GraphQLString},
    password: {type: GraphQLString},
    password_f: {type: GraphQLString},
    password_g: {type: GraphQLString},
    pais: {type: GraphQLString},
    alumno_mysql: {type: GraphQLInt},

    cursos: {
      type: GraphQLList(CursoType),
      async resolve({id}, args, {models}) {

        return models.Curso.getByAlumnoIdAndEstado(id, true)
      }
    },
  }
})

const CertificadoPreType = new GraphQLObjectType({
  name: "CertificadoPre",
  fields: {
    id: {type: GraphQLInt},
    codigo: {type: GraphQLString},
    matricula_id: {type: GraphQLInt},
    nota: {type: GraphQLFloat},
    lado_uno: {type: GraphQLString},
    lado_dos: {type: GraphQLString},
    tipo: {type: GraphQLString},
    taller_dias: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime}
  }
})

const MatriculaType = new GraphQLObjectType({
  name: "Matricula",
  fields: {
    id: {type: GraphQLInt},
    curso_id: {type: GraphQLInt},
    alumno_id: {type: GraphQLInt},
    pago: {type: GraphQLFloat},
    descuento: {type: GraphQLFloat},
    fecha_pago: {type: GraphQLDate},
    nuevo: {type: GraphQLBoolean},
    voucher: {type: GraphQLString},
    descripcion: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    estado: {type: GraphQLBoolean},
    valoracion_curso: {type: GraphQLInt},
    valoracion_docente: {type: GraphQLInt},
    vc_mensaje: {type: GraphQLString},
    vd_mensaje: {type: GraphQLString},
    nota: {type: GraphQLFloat},
    matricula_mysql: {type: GraphQLInt},
    user_id: {type: GraphQLInt},
    cantidad: {type: GraphQLInt},
    importe: {type: GraphQLFloat},
    alumnos: {type: GraphQLInt},
    drive: {type: GraphQLString},

    alumno: {
      type: AlumnoType,
      resolve({alumno_id}, args, {models}) {

        return models.Alumno.getById(alumno_id)
      }
    },
    curso: {
      type: CursoType,
      resolve({curso_id}, args, {models}) {

        return models.Curso.getById(curso_id)
      }
    },
    certificado: {
      type: CertificadoPreType,
      resolve({id}, args, {models}) {

        return models.Certificado.getByMatriculaId(id)
      }
    },
    user: {
      type: UserType,
      resolve({user_id}, args, {models}) {

        return models.User.getById(user_id)
      }
    },
  }
})

const PromocionHasCursosType = new GraphQLObjectType({
  name: "PromocionHasCursos",
  fields: {
    promocion_id: {type: GraphQLInt},
    curso_id: {type: GraphQLInt},
    created_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},

    cursos: {
      type: GraphQLList(CursoType),
      resolve({promocion_id}, args, {models}) {

        return models.Curso.getByPromocionId(promocion_id)
      }
    }
  }
})

const PromocionType = new GraphQLObjectType({
  name: "Promocion",
  fields: {
    id: {type: GraphQLInt},
    codigo: {type: GraphQLString},
    descuento: {type: GraphQLFloat},
    fecha_inicio: {type: GraphQLDateTime},
    fecha_fin: {type: GraphQLDateTime},
    descripcion: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},

    cursos: {
      type: GraphQLList(CursoType),
      resolve({id}, args, {models}) {

        return models.Curso.getByPromocionId(id)
      }
    }
  }
})

const NotificationType = new GraphQLObjectType({
  name: "Notification",
  fields: {
    id: {type: GraphQLInt},
    nombre: {type: GraphQLString},
    message: {type: GraphQLString},
    send_at: {type: GraphQLDateTime},
    readed_at: {type: GraphQLDateTime},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    onesignal_id: {type: GraphQLString},
    now: {type: GraphQLBoolean},
    tipo: {type: GraphQLInt},

    cursos: {
      type: GraphQLList(CursoType),
      resolve({id}, args, {models}) {

        return models.NotificationHasCurso.getAllByCursoId(id)
      }
    }
  }
})

const NotificationHasCursoType = new GraphQLObjectType({
  name: "NotificationHasCurso",
  fields: {
    notification_id: {type: GraphQLInt},
    curso_id: {type: GraphQLInt},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
  }
})

const DeviceType = new GraphQLObjectType({
  name: "Device",
  fields: {
    id: {type: GraphQLInt},
    alumno_id: {type: GraphQLInt},
    device_id: {type: GraphQLString},
    status: {type: GraphQLBoolean},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
  }
})

const FileType = new GraphQLObjectType({
  name: "File",
  fields: {
    file: {type: GraphQLString},
    filename: {type: GraphQLString},
    mimetype: {type: GraphQLString},
    encoding: {type: GraphQLString},
  }
})

const DetallePackType = new GraphQLObjectType({
  name: "DetallePak",
  fields: {
    id: {type: GraphQLInt},
    pack_id: {type: GraphQLInt},
    curso_id: {type: GraphQLInt},
    precio: {type: GraphQLFloat},
    descuento: {type: GraphQLFloat},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},

    curso: {
      type: CursoType,
      resolve({curso_id}, args, {models}) {

        return models.Curso.getById(curso_id)
      }
    }
  }
})

const PackType = new GraphQLObjectType({
  name: "Pack",
  fields: {
    id: {type: GraphQLInt},
    alumno_email: {type: GraphQLString},
    payu_id: {type: GraphQLString},
    fecha_emision: {type: GraphQLDate},
    moneda: {type: GraphQLString},
    observaciones: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    estado: {type: GraphQLBoolean},
    importe: {type: GraphQLFloat},
    voucher: {type: GraphQLString},

    alumno: {
      type: AlumnoType,
      resolve({alumno_email}, args, {models}) {

        return models.Alumno.getByEmail(alumno_email.toString().trim().toLowerCase())
      }
    },
    detalle: {
      type: GraphQLList(DetallePackType),
      resolve({id}, args, {models}) {

        return models.DetallePack.getAllByPackId(id)
      }
    }
  }
})

const CertificadoType = new GraphQLObjectType({
  name: "Certificado",
  fields: {
    id: {type: GraphQLInt},
    codigo: {type: GraphQLString},
    matricula_id: {type: GraphQLInt},
    nota: {type: GraphQLFloat},
    lado_uno: {type: GraphQLString},
    lado_dos: {type: GraphQLString},
    tipo: {type: GraphQLString},
    taller_dias: {type: GraphQLString},
    created_at: {type: GraphQLDateTime},
    updated_at: {type: GraphQLDateTime},
    deleted_at: {type: GraphQLDateTime},
    file_name: {type: GraphQLString},

    matricula: {
      type: MatriculaType,
      resolve({matricula_id}, args, {models}) {

        return models.Matricula.getById(matricula_id)
      }
    }
  }
})

const ReporteType = new GraphQLObjectType({
  name: "Reporte",
  fields: {
    curso: {type: GraphQLString},
    alumno: {type: GraphQLString},
    fecha_registro: {type: GraphQLDateTime},
    fecha_pago: {type: GraphQLDate},
    monto: {type: GraphQLString},
    descuento: {type: GraphQLString},
    usuario: {type: GraphQLString},
    fileName: {type: GraphQLString}
  }
})

module.exports = {
  ApiRestType,
  CursoType,
  CategoriaType,
  UserType,
  DocenteType,
  ModalidadType,
  ModuloType,
  ArchivoType,
  AlumnoType,
  MatriculaType,
  PromocionType,
  PromocionHasCursosType,
  SesionType,
  RoleType,
  PermissionType,
  NotificationType,
  NotificationHasCursoType,
  DeviceType,
  FileType,
  SesionDiasType,
  SubcategoriaType,
  CommentType,
  LikeType,
  PackType,
  DetallePackType,
  MarcadorType,
  ReproduccionType,
  AsistenciaType,
  CertificadoType,
  ReporteType
}