import Handlebars from 'handlebars'
import moment from 'moment-timezone'
import d2d from 'degrees-to-direction'
import linkify from 'linkify-html'

export default () => {
  Handlebars.registerHelper('trim', function (passedString) {
    if (typeof passedString === 'undefined') {
      return new Handlebars.SafeString('')
    }

    let theString = passedString.trim().replace(/^\s+|\s+$/g, '')
    return new Handlebars.SafeString(theString)
  })

  Handlebars.registerHelper('find', function (property, needle, haystack, returnProp) {
    let found = haystack.find(i => i[property] === needle)
    if (typeof (returnProp) !== 'object') {
      return found && found[returnProp]
    }

    return found
  })

  Handlebars.registerHelper('prettyDate', function (passedString) {
    if (!passedString) {
      return ''
    }
    let date = new Date(Number(passedString) * 1000)
    return new Handlebars.SafeString(date.toString())
  })

  Handlebars.registerHelper('concat', function () {
    let args = Array.prototype.slice.call(arguments)
    return new Handlebars.SafeString(args.slice(0, -1).join(''))
  })

  Handlebars.registerHelper('date', function (passedString, myDate, inputDateFormat, timezone) {
    if (!myDate) {
      return ''
    }
    let m
    if (myDate && typeof (inputDateFormat) === 'string') {
      m = moment(myDate, inputDateFormat)
    } else {
      m = moment()
    }

    if (timezone && arguments.length > 4) {
      return new Handlebars.SafeString(m.tz(timezone).format(passedString))
    }

    return new Handlebars.SafeString(m.format(passedString))
  })

  Handlebars.registerHelper('uglyDate', function (passedString, inputDateFormat, timezone) {
    if (!passedString) {
      return ''
    }

    let date = moment.tz(moment(passedString, inputDateFormat)
      .format('YYYY-MM-DD HH:mm:ss'), timezone).format('X')
    return new Handlebars.SafeString(date)
  })

  Handlebars.registerHelper('now', function (passedString, timezone, offset) {
    if (!passedString) {
      return ''
    }
    let date = moment.tz(timezone)
    if (typeof offset !== 'object') {
      date = date.add(offset, 'milliseconds')
    }
    return new Handlebars.SafeString(date.format(passedString))
  })

  Handlebars.registerHelper('deg2Dir', function (passedString) {
    let direction = d2d(Number(passedString))
    return new Handlebars.SafeString(direction)
  })

  Handlebars.registerHelper('Num', function (passedString) {
    return Number(passedString)
  })

  Handlebars.registerHelper('isNaN', function (passedNumber) {
    return Number.isNaN(passedNumber)
  })

  Handlebars.registerHelper('replaceValue', function (passedString, passedArray, data) {
    if (typeof passedString === 'undefined') {
      return new Handlebars.SafeString('')
    }

    passedString = passedString.trim()
    let values = JSON.parse(passedArray.replace(/\\"/g, '"'))
    let found = values.find(value => value.search === passedString)
    let replaced
    if (found) {
      replaced = found.replaceWith
    }
    return new Handlebars.SafeString(replaced || passedString)
  })

  Handlebars.registerHelper('replaceFirst', function (passedString, needle, replacement) {
    if (typeof passedString === 'undefined') {
      return new Handlebars.SafeString('')
    }

    passedString = passedString.replace(needle, replacement)
    passedString = passedString.trim()

    return new Handlebars.SafeString(passedString)
  })

  Handlebars.registerHelper('strip', function (passedString, arg) {
    let values = [arg]
    if (arg.indexOf('[') === 0 && arg.indexOf(']') !== -1) {
      values = JSON.parse(arg.replace(/\\"/g, '"'))
    }

    values.forEach(function (value) {
      let re = new RegExp(`\\${value}`, 'g')
      passedString = passedString ? passedString.replace(re, '') : ''
    })

    return new Handlebars.SafeString(passedString)
  })

  Handlebars.registerHelper('determineValue', function (values, ...args) {
    let vals = JSON.parse(values.replace(/\\"/g, '"'))
    let tests = args.filter(test => {
      return typeof test === 'string'
    }).map(test => {
      return test.toLowerCase()
    })

    for (let i = 0; i < vals.length; i++) {
      if (tests.includes(vals[i].toLowerCase())) {
        return vals[i]
      }
    }

    return ''
  })

  Handlebars.registerHelper('includes', function (passedString, values) {
    let valuesArray
    try {
      valuesArray = values.trim().toLowerCase()
      valuesArray = JSON.parse(valuesArray.replace(/\\"/g, '"'))
      passedString = passedString.toString().trim().toLowerCase()
    } catch (err) {
      valuesArray = []
    }

    return valuesArray.includes(passedString)
  })

  Handlebars.registerHelper('split', function (passedString, delimiter) {
    if (!passedString) {
      return []
    }
    return passedString.split(delimiter)
  })

  Handlebars.registerHelper('sum', function (...numbers) {
    return numbers.reduce((sum, num) => {
      const forcedNumber = Number(num)
      if (!isNaN(forcedNumber) && typeof forcedNumber === 'number') {
        return sum + forcedNumber
      } else {
        return sum
      }
    }, 0)
  })

  Handlebars.registerHelper('linkify', function (passedString) {
    if(!passedString){
      return ''
    }

    if(passedString.string){
      passedString = passedString.string
    }
    return new Handlebars.SafeString(linkify(passedString, { defaultProtocol: 'https' }))
  })

  Handlebars.registerHelper('brFromNewLine', function(passedString) {
    if(!passedString){
      return ''
    }

    if(passedString.string){
      passedString = passedString.string
    }
    return new Handlebars.SafeString(passedString.replace(/\r?\n|\r/g, '<br />'))
  })
}
