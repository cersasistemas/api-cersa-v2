const nodemailer = require("nodemailer")
const fs = require("fs")

const {createToken} = require("./jwt")

const sendEmail = async ({user, tipo, curso, alumno}) => {
  const {authentication} = await createToken(user)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  })

  let url = '', subject = '', email = '', html = ''
  const dirname = '/srv/app'
  // const dirname = '.'
  const plantilla = fs.readFileSync(`${dirname}/public/emails/${tipo}.html`, 'utf-8')

  switch (tipo) {
    case 'reset':
      url = 'password/reset'
      subject = 'Restablecer Contraseña'
      email = `/${user.email}`
      html = plantilla.replace('reset_url', `${process.env.CERSA_WEB}/${url}/${authentication}${email}`)
      break
    case 'verify':
      url = 'account/verify'
      subject = 'Confirma tu cuenta'
      html = plantilla.replace('reset_url', `${process.env.CERSA_WEB}/${url}/${authentication}${email}`)
      break
    case 'matricula':
      url = `app/matriculas/${curso.id}`
      subject = `Matrícula pendiente - ${alumno.dni ? `${alumno.dni} - ` : ''}${alumno.nombres ? `${alumno.nombres} ` : ''}${alumno.a_paterno ? `${alumno.a_paterno} ` : ''}${alumno.a_materno ? alumno.a_materno : ''}`
      html = plantilla.replace('matricula_url', `${process.env.CERSA_WEB}/${url}`)
      html = html.replace('new_matricula', `${alumno.dni ? `${alumno.dni} - ` : ''}${alumno.nombres ? `${alumno.nombres} ` : ''}${alumno.a_paterno ? `${alumno.a_paterno} ` : ''}${alumno.a_materno ? alumno.a_materno : ''}`)
      break
    case 'register':
      url = `login`
      subject = `Credenciales`
      html = plantilla.replace('new_credenciales', `ALUMNO: ${alumno.dni ? `${alumno.dni} - ` : ''}${alumno.nombres ? `${alumno.nombres} ` : ''}${alumno.a_paterno ? `${alumno.a_paterno} ` : ''}${alumno.a_materno ? alumno.a_materno : ''}
      <br>USER: ${alumno.email.toString().trim().toLowerCase()}<br>PASSWORD: ${alumno.password}`)
      break
    case 'confirmacionMatricula':
      subject = 'Confirmación de Matrícula'
      html = plantilla.replace('alumno_name', `${alumno.nombres ? `${alumno.nombres} ` : ''}${alumno.a_paterno ? `${alumno.a_paterno} ` : ''}${alumno.a_materno ? alumno.a_materno : ''}`)
      html = html.replace('curso_name', curso.nombre_completo ? curso.nombre_completo.toString().toUpperCase() : '')
      html = html.replace('url_driver', alumno.drive)
      break
  }

  let info = await transporter.sendMail({
    from: process.env.MAIL_USERNAME,
    to: user.email.toString().trim().toLowerCase(),
    subject,
    html
  })

  return {
    ...info,
    authentication
  }
}

module.exports = sendEmail