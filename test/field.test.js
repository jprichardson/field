var assert = require('assert')
var field = require('../lib/field')

/* global describe it */

var database = {
  'development': {
    'name': 'myapp_development',
    'host': '127.0.0.1',
    'port': 27017
  },
  'test': {
    'name': 'myapp_test',
    'host': '127.0.0.1',
    'port': 27017
  },
  'production': {
    'name': 'myapp_production',
    'host': 'myserver.com',
    'port': 27017
  }
}

describe('field', function () {
  describe('- get', function () {
    describe('> when field path is specified', function () {
      it('should retrieve the value', function () {
        assert.strictEqual(field.get(database, 'production.host'), 'myserver.com')
        assert.strictEqual(field.get(database, 'asdfasdfasdfa'), undefined) // doesn't exist

        assert.strictEqual(field.get(database, 'production.host'), field.get(database, 'production:host'))
      })
    })

    describe('> when bind is used', function () {
      it('should properly bind and retrieve the value', function () {
        var a = {database: {production: {host: 'myserver.com'}}}
        a.get = field.get.bind(a)
        assert.strictEqual(a.get('database:production.host'), 'myserver.com')
      })
    })
  })

  describe('- set', function () {
    describe('> when a a field path is specified', function () {
      it('should set the value', function () {
        assert.strictEqual(database.production.host, 'myserver.com')
        assert.strictEqual(field.set(database, 'production.host', 'yourserver.com'), 'myserver.com')
        assert.strictEqual(database.production.host, 'yourserver.com')

        assert.strictEqual(field.set(database, 'production.doesnotexist', 'nope'), undefined)
        assert.strictEqual(database.production.doesnotexist, 'nope')

        assert.strictEqual(field.set(database, 'production.location.short', 'US'), undefined)
        assert.strictEqual(database.production.location.short, 'US')

        assert.strictEqual(field.set(database, 'production.name.something.special', 'superman'), undefined)
        assert.strictEqual(database.production.name.something.special, 'superman')

        assert.strictEqual(field.set(database, 'production.country', false), undefined)
        assert.strictEqual(field.get(database, 'production.country'), false)
      })
    })

    describe('> when bind is used', function () {
      it('it should properly bind and set the value', function () {
        var a = {}
        a.set = field.set.bind(a)
        a.set('database:production.host', 'myserver.com')
        assert.strictEqual(a.database.production.host, 'myserver.com')
      })
    })
  })
})
