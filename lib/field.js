;(function (root) {

function get (topObj, fields) {
  if (typeof fields !== 'string') throw new Error('field.get must pass in a string.')  
  fields = fields.split(/\.|\:/)

  function levelUp (obj, field) {
    if (typeof obj[field] !== 'undefined') { //we care about falsey values
      if (fields.length === 0)
        return obj[field]
      else
        return levelUp(obj[field], fields.shift())
    } else
      return undefined;
  }
  return levelUp(topObj, fields.shift())
}

function set (topObj, fields, value) {
  if (typeof fields !== 'string') throw new Error('field.set must pass in a string.') 
  fields = fields.split(/\.|\:/)
  
  function levelUp (obj, field, value) {
    if (typeof obj[field] !== 'undefined') { //we care about falsey values
      if (fields.length === 0) {
        var oldVal = obj[field]
        obj[field] = value
        return oldVal
      } else { 
        if (typeof obj[field] !== 'object') { //we have more fields to go, so we need to replace the current non-object
          obj[field] = {}
        }
        return levelUp(obj[field], fields.shift(), value)
      }
    } else {
      //keep going if necessary
      if (fields.length === 0) {
        obj[field] = value
        return undefined;
      } else {
        //var newField = fields.shift()
        obj[field] = {}//{newField: value}
        return levelUp(obj[field], fields.shift(), value)
      }
    }
  }
  return levelUp(topObj, fields.shift(), value)
}

root.get = get
root.set = set

})(module.exports || window);
