const xl = require('excel4node')
const uniqid = require('uniqid')
const moment = require('moment')

createExcelVentas = async data => {
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

  const ws = wb.addWorksheet('VENTAS',options)
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

  ws.cell(2, 2, 2, 9, true).string('REPORTE DE VENTAS').style(styleheader)
  ws.column(2).setWidth(5)
  ws.column(3).setWidth(90)
  ws.column(4).setWidth(80)
  ws.column(5).setWidth(30)
  ws.column(6).setWidth(20)
  ws.column(7).setWidth(20)
  ws.column(8).setWidth(20)
  ws.column(9).setWidth(80)
  ws.cell(3, 2).string('N°').style(styleheader)
  ws.cell(3, 3).string('CURSO').style(styleheader)
  ws.cell(3, 4).string('ALUMNO').style(styleheader)
  ws.cell(3, 5).string('FECHA DE REGISTRO').style(styleheader)
  ws.cell(3, 6).string('FECHA DE PAGO').style(styleheader)
  ws.cell(3, 7).string('MONTO').style(styleheader)
  ws.cell(3, 8).string('DESCUENTO').style(styleheader)
  ws.cell(3, 9).string('USUARIO').style(styleheader)

  data.forEach((venta, index) => {
    const {curso, alumno, fecha_registro, fecha_pago, monto, descuento, usuario} = venta

    ws.cell(index + 4, 2).number(Number(index + 1)).style(stylenumber).style({
      alignment: {
        horizontal: 'center',
      }
    })
    ws.cell(index + 4, 3).string(curso).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
    ws.cell(index + 4, 4).string(alumno).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
    ws.cell(index + 4, 5).string(moment(fecha_registro).format('YYYY-MM-DD HH:mm:ss')).style(style).style({
      alignment: {
        horizontal: 'center',
      }
    })
    ws.cell(index + 4, 6).string(moment(fecha_pago).format('YYYY-MM-DD')).style(style).style({
      alignment: {
        horizontal: 'center',
      }
    })
    ws.cell(index + 4, 7).number(Number(monto)).style(style).style({
      alignment: {
        horizontal: 'right',
      },
      numberFormat: '#,##0.00; (#,##0.00); 0.00',
    })
    ws.cell(index + 4, 8).number(Number(descuento)).style(style).style({
      alignment: {
        horizontal: 'right',
      },
      numberFormat: '#,##0.00; (#,##0.00); 0.00',
    })
    ws.cell(index + 4, 9).string(usuario).style(style).style({
      alignment: {
        horizontal: 'left',
      }
    })
  })

  const url = `public/excel/Reporte de Ventas - ${fileName}.xlsx`

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