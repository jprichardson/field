var testutil = require('testutil')
  , field = require('../lib/field');

var database = {
  "development": {
    "name": "myapp_development",
    "host": "127.0.0.1",
    "port": 27017
  },
  "test": {
    "name": "myapp_test",
    "host": "127.0.0.1",
    "port": 27017
  },
  "production": {
    "name": "myapp_production",
    "host": "myserver.com",
    "port": 27017
  }
}

describe('field', function() {
  describe('- get', function() {
    describe('> when field path is specified', function() {
      it('should retrieve the value', function() {
        EQ (field.get(database, 'production.host'), 'myserver.com')
        EQ (field.get(database, 'asdfasdfasdfa'), undefined) //doesn't exist

        EQ (field.get(database, 'production.host'), field.get(database, 'production:host'))
      })
    })

    describe('> when bind is used', function() {
      it('should properly bind and retrieve the value', function() {
        var a = {database: {production: {host: 'myserver.com'}}}
        a.get = field.get.bind(a)
        EQ (a.get('database:production.host'), 'myserver.com')
      })
    })
  })

  describe('- set', function() {
    describe('> when a a field path is specified', function() {
      it('should set the value', function() {
        EQ (database.production.host, 'myserver.com')
        EQ (field.set(database, 'production.host', 'yourserver.com'), 'myserver.com')
        EQ (database.production.host, 'yourserver.com')

        EQ (field.set(database, 'production.doesnotexist', 'nope'), undefined)
        EQ (database.production.doesnotexist, 'nope')

        EQ (field.set(database, 'production.location.short', 'US'), undefined)
        EQ (database.production.location.short, 'US')

        EQ (field.set(database, 'production.name.something.special', 'superman'), undefined)
        EQ (database.production.name.something.special, 'superman')

        EQ (field.set(database, 'production.country', false), undefined)
        EQ (field.get(database, 'production.country'), false)
      })
    })
  
    describe('> when bind is used', function() {
      it('it should properly bind and set the value', function() {
        var a = {}
        a.set = field.set.bind(a)
        a.set('database:production.host', 'myserver.com')
        EQ (a.database.production.host, 'myserver.com')
      })
    })
  })
})
