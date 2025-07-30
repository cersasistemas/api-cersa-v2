const moment = require("moment")
const bcrypt = require("bcrypt")

Array.prototype.unique = function (a) {
  return function () {
    return this.filter(a)
  }
}(function (a, b, c) {
  return c.indexOf(a, b + 1) < 0
})

Array.prototype.uniqueObject = function (element) {
  return [...new Set(this.map(item => item[element].toString()))]
}

module.exports = {
  update: ({id, update}) => {
    let set = '', values = [id]

    const keys = Object.keys(update)

    keys.forEach((element, index) => {
      set += `${[element]}=$${index + 2}, `
      values.push(update[element])
    })

    set += `updated_at=$${keys.length + 2}`
    values.push(moment().utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'))

    return {set, values}
  },
  fields: (fields, update) => {
    fields = Object.keys(fields)
    update = Object.keys(update)

    const errors = []
    update.forEach(element => {
      const included = fields.includes(element)

      if (!included) errors.push(element)
    })

    return errors
  },
  timestamp: () => moment().utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
  dateTime: dateTime => moment(dateTime).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
  dateTime30min: dateTime => moment(dateTime).subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
  passwordHash: async password => await bcrypt.hash(password, 10)
}