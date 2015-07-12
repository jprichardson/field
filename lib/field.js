var assert = require('assert')

var FIELD_REGEX = /\.|\:/

function get (topObj, fields) {
  if (typeof topObj === 'string' && arguments.length === 1) {
    fields = topObj
    topObj = this // hopefully using bind
  }
  assert(typeof fields === 'string', 'field.get(): must pass in a field string.')

  fields = fields.split(FIELD_REGEX)

  function moveUp (obj, field) {
    if (typeof obj[field] !== 'undefined') { // we care about falsey values
      if (fields.length === 0) return obj[field]
      else return moveUp(obj[field], fields.shift())
    } else {
      return undefined
    }
  }
  return moveUp(topObj, fields.shift())
}

function set (topObj, fields, value) {
  if (typeof topObj === 'string' && arguments.length === 2) {
    value = fields
    fields = topObj
    topObj = this // hopefully using bind
  }
  assert(typeof fields === 'string', 'field.get(): must pass in a field string.')

  fields = fields.split(FIELD_REGEX)

  function moveUp (obj, field, value) {
    if (typeof obj[field] !== 'undefined') { // we care about falsey values
      if (fields.length === 0) {
        var oldVal = obj[field]
        obj[field] = value
        return oldVal
      } else {
        if (typeof obj[field] !== 'object') { // we have more fields to go, so we need to replace the current non-object
          obj[field] = {}
        }
        return moveUp(obj[field], fields.shift(), value)
      }
    } else {
      // keep going if necessary
      if (fields.length === 0) {
        obj[field] = value
        return undefined
      } else {
        // var newField = fields.shift()
        obj[field] = {}// {newField: value}
        return moveUp(obj[field], fields.shift(), value)
      }
    }
  }

  return moveUp(topObj, fields.shift(), value)
}

module.exports = {
  get: get,
  set: set
}
