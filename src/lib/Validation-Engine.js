/**
 * Copyright (c) 2015-2020, PlatypusMeister (Paul Varache)
 * Copyright (c) 2020, Burnett01 (Steven Agyekum)
 * 
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose with or without fee is hereby granted, 
 * provided that the above copyright notice and this permission 
 * notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES 
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. 
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, 
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, 
 * DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, 
 * ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
const validator = require('validator')

const checkScope = (validate, scope, req) => {
  const errors = []

  for (const fieldName in validate) {
    // Check the validity of the field
    const fieldError = checkField(
      validate[fieldName],
      scope[fieldName],
      fieldName,
      req)

    if (!fieldError) continue

    const error = (fieldError instanceof Error) ? fieldError : {
      message: fieldError,
      field: fieldName,
      given: scope[fieldName]
    }

    errors.push(error)
  }
  return errors
}

const checkField = (checks, field, fieldName, req) => {

  let params = []

  // Stop the check if the field is not required and not here
  if (!checks.required && !validator.required(field))
    return null

  // Loop through the checks
  for (var key in checks) {
    // Extract the params (if defined)
    params = checks[key].params ? checks[key].params.slice() : []
    // Add the field as the first param
    params.unshift(field)
    // Add the request object to params
    params.push(req)

    // Run the validation with the params
    if (validator[key].apply(validator, params)) continue
    // The message is the value of the fields check
    if (typeof checks[key] === 'string' || checks[key] instanceof Error)
      return checks[key]
    // We return a generic error
    return 'The parameter `' + fieldName + '` did not pass the `' + key + '` test'
  }
  return null
}

module.exports = options => {
  options = options || {}
  options.customValidators = options.customValidators || {}
  options.formatter = options.formatter || function (errors) {
    if (Array.isArray(errors))
      return { errors: errors }
    return errors
  }

  // Add a `required` validator
  validator['required'] = field => {
    return !!field && field !== ''
  }

  // Add all the custom validators
  for (const key in options.customValidators)
    validator[key] = options.customValidators[key].bind(validator)

  const scopes = options.scopes || ['params', 'body']

  return (req, res, next) => {

    req.body = req.body || {}
    let errors = []
    let key = req.route.validate

    if (req.route && key) {
      // Iterate array of scope objects
      if (key instanceof Array) {
        key = key.reduce((o, n) => {
          return {
            ...o,
            ...n
          }
        })
      }

      // Chek every scope
      scopes
        .filter(scope => !!key[scope])
        .forEach(scope => {
          const scopeErrors = checkScope(key[scope], req[scope], req)
            .map(scopeError => {
              scopeError.scope = scope
              return scopeError
            })
          errors = errors.concat(scopeErrors)
        })
    }

    // Return the errors if any otherwise go to the next middleware
    if (!errors.length) return next()

    const formatter = key.formatter || options.formatter
    const body = options.multipleErrors ? errors : errors[0]

    if (!body.length && body instanceof Error)
      return next(body)

    return res.send(400, formatter(body))
  }
}
