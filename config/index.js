require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 3000,
  portHttps: process.env.PORT_HTTPS || 3001,
  cors: process.env.CORS,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  mailUser: process.env.MAIL_USER || 'notificacionescersa@gmail.com',
  mailPass: process.env.MAIL_PASS || 'afzlgrliebrufezf',
  srvKey: process.env.SRV_KEY,
  srvCert: process.env.SRV_CERT
};

module.exports = {config};