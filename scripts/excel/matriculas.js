const xl = require('excel4node')
const uniqid = require('uniqid')
const moment = require('moment')

createExcelVentas = async (data, curso) => {
  const fileName = uniqid()
  const options = {
    sheetView: {
      showGridLines: false,
    },
  }
  const wb = new xl.Workbook({
    defaultFont: {
      size: 10,
      name: 'Arial Narrow'
    },
    author: 'Instituto CERSA'
  })

  const ws = wb.addWorksheet('MATRÍCULAS',options)
  const style = wb.createStyle({
    border: {
      left: {
        style: 'thin',
        color: 'black',
      },
      right: {
        style: 'thin',
        color: 'black',
      },
      top: {
        style: 'thin',
        color: 'black',
      },
      bottom: {
        style: 'thin',
        color: 'black',
      },
    }
  })
  const stylenumber = wb.createStyle({
    border: {
      left: {
        style: 'thin',
        color: 'black',
      },
      right: {
        style: 'thin',
        color: 'black',
      },
      top: {
        style: 'thin',
        color: 'black',
      },
      bottom: {
        style: 'thin',
        color: 'black',
      },
    },
    alignment: {
      horizontal: "center",
    },
  })
  const styleheader = wb.createStyle({
    border: {
      left: {
        style: 'thin',
        color: 'black',
      },
      right: {
        style: 'thin',
        color: 'black',
      },
      top: {
        style: 'thin',
        color: 'black',
      },
      bottom: {
        style: 'thin',
        color: 'black',
      },
    },
    alignment: {
      horizontal: "center",
    }
  })

  ws.cell(2, 2, 2, 13, true).string('REPORTE DE MATRÍCULAS').style(styleheader)
  ws.cell(3, 2, 3, 13, true).string(curso.nombre_completo).style(styleheader)
  ws.column(2).setWidth(5)
  ws.column(3).setWidth(20)
  ws.column(4).setWidth(70)
  ws.column(5).setWidth(40)
  ws.column(6).setWidth(20)
  ws.column(7).setWidth(50)
  ws.column(8).setWidth(20)
  ws.column(9).setWidth(30)
  ws.column(10).setWidth(30)
  ws.column(11).setWidth(50)
  ws.column(12).setWidth(80)
  ws.column(13).setWidth(30)
  ws.cell(4, 2).string('N°').style(styleheader)
  ws.cell(4, 3).string('DNI').style(styleheader)
  ws.cell(4, 4).string('NOMBRES').style(styleheader)
  ws.cell(4, 5).string('EMAIL').style(styleheader)
  ws.cell(4, 6).string('CELULAR').style(styleheader)
  ws.cell(4, 7).string('PROFESIÓN').style(styleheader)
  ws.cell(4, 8).string('SIGLAS').style(styleheader)
  ws.cell(4, 9).string('FECHA DE NACIMIENTO').style(styleheader)
  ws.cell(4, 10).string('PAIS').style(styleheader)
  ws.cell(4, 11).string('CIUDAD').style(styleheader)
  ws.cell(4, 12).string('DIRECCIÓN').style(styleheader)
  ws.cell(4, 13).string('FECHA DE MATRÍCULA').style(styleheader)

  data.forEach((matricula, index) => {
    const {alumno, pago,  descuento, fecha_pago, nuevo, voucher, descripcion, estado, created_at} = matricula
    const {siglas, nombres, a_paterno, a_materno, nacimiento, dni, celular, avatar, direccion, departamento, provincia, distrito, profesion, email, pais} = alumno

    ws.cell(index + 5, 2).number(Number(index + 1)).style(stylenumber).style({
      alignment: {
        horizontal: 'center',
      }
    })
    ws.cell(index + 5, 3).string(dni).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
    ws.cell(index + 5, 4).string(`${nombres ? nombres : ''}${a_paterno ? ` ${a_paterno}` : ''}${a_materno ? ` ${a_materno}` : ''}`).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
    ws.cell(index + 5, 5).string(email).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
    ws.cell(index + 5, 6).string(celular).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
    ws.cell(index + 5, 7).string(profesion).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
    ws.cell(index + 5, 8).string(siglas).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
    ws.cell(index + 5, 9).string(moment(nacimiento).isValid() ? moment(nacimiento).format('YYYY-MM-DD') : '').style(style).style({
      alignment: {
        horizontal: 'center',
      }
    })
    ws.cell(index + 5, 10).string(pais).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
    ws.cell(index + 5, 11).string(departamento).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
    ws.cell(index + 5, 12).string(direccion).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
    ws.cell(index + 5, 13).string(moment(created_at).format('YYYY-MM-DD HH:mm:ss')).style(style).style({
      alignment: {
        horizontal: 'center',
      }
    })
  })

  const url = `public/excel/Reporte de Matriculados - ${fileName}.xlsx`

  return new Promise((resolve, reject) => {
    wb.write(url, (err, stats) => {
      if (err) return reject(err)
      return resolve({
        fileName
      })
    });
  })
}

module.exports = createExcelVentas