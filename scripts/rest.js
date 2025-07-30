const request = require('request')

require('dotenv').config()

module.exports = {
  ApiRest: async ({path, data}) => {
    const options = {
      url: `${process.env.API_REST}/${path}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEARER}`
      },
      json: data
    }

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) return reject(error)

        return resolve(body)
      })
    })
  },
}