const request = require("request")
require('dotenv').config()

module.exports = {
  onesignal: json => {
    const options = {
      url: 'https://onesignal.com/api/v1/notifications',
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${process.env.NOTIFICATION}`
      },
      json
    }

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) return reject(error)

        return resolve(body)
      })
    })
  },
  onesignalDelete: onesignal_id => {
    const options = {
      url: `https://onesignal.com/api/v1/notifications/${onesignal_id}?app_id=${process.env.NOTIFICATION_APP_ID}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${process.env.NOTIFICATION}`
      }
    }

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) return reject(error)

        return resolve(body)
      })
    })
  }
}