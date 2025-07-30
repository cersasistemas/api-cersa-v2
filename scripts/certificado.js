const html_to_pdf = require('html-pdf-node')
const fs = require('fs')
const uniqid = require("uniqid")
const QRCode = require("qrcode")

const createPdf = async certificado => {
  const file_name = `${uniqid()}.pdf`

  let options = {
    format: 'A4',
    landscape: true,
    printBackground: true
  }

  const qr = await QRCode.toDataURL('https://cp.cersa.org.pe/buscador/70212067')
  console.log(qr)

  let html = `<!DOCTYPE html>
<html lang="es">
<head>
    <title>Certificado</title>
</head>
<body style="background-image: url('http://127.0.0.1:3001/images/certificados/4q2jtj8nckf4w6zvj.jpeg'); 
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 29.7cm 21cm;
  ">
  <img src="" alt="Logo">
  <img src="https://qr-generator.qrcode.studio/qr/custom?download=true&file=png&data=https%3A%2F%2Fcersa.org.pe%2FRegistrodeCertificados2%2Fcertificado.php%3Fregistro%3D${certificado.codigo}&size=1000&config=%7B%22body%22%3A%22square%22%2C%22eye%22%3A%22frame2%22%2C%22eyeBall%22%3A%22ball2%22%2C%22erf1%22%3A%5B%22fv%22%5D%2C%22erf2%22%3A%5B%5D%2C%22erf3%22%3A%5B%5D%2C%22brf1%22%3A%5B%22fv%22%5D%2C%22brf2%22%3A%5B%5D%2C%22brf3%22%3A%5B%5D%2C%22bodyColor%22%3A%22%23000000%22%2C%22bgColor%22%3A%22%23FFFFFF%22%2C%22eye1Color%22%3A%22%23000000%22%2C%22eye2Color%22%3A%22%23000000%22%2C%22eye3Color%22%3A%22%23000000%22%2C%22eyeBall1Color%22%3A%22%23000000%22%2C%22eyeBall2Color%22%3A%22%23000000%22%2C%22eyeBall3Color%22%3A%22%23000000%22%2C%22gradientColor1%22%3A%22%231A92C6%22%2C%22gradientColor2%22%3A%22%230d4a83%22%2C%22gradientType%22%3A%22linear%22%2C%22gradientOnEyes%22%3A%22true%22%2C%22logo%22%3A%22%22%2C%22logoMode%22%3A%22default%22%7D" style="height: 130px; margin-top: 575px; margin-left: 30px" alt="QR">
  <p style="margin: 0 38px; font-size: 18px; color: #ffffff">${certificado.codigo}</p>
</body>
</html>`

  let file = {content: html}
  const pdf = await html_to_pdf.generatePdf(file, options)
  fs.writeFileSync(`./public/certificados/${file_name}`, pdf)

  return file_name
}

module.exports = createPdf