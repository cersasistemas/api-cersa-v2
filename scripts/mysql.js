const mysql = require('mysql')
const util = require('util')

require('dotenv').config()

const db = () => {
  const connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_NAME
  })

  return {
    many(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args)
    },
    async one(sql, args) {
      const row = await util.promisify(connection.query).call(connection, sql, args)
      return row[0]
    },
    close() {
      return util.promisify(connection.end).call(connection)
    }
  }
}

module.exports = db()