Node.js - field
================

Easily set and get values of a field in your JavaScript object.


Why?
----

I got tired of doing this:

```js
var dbPort = (config && config.environment && config.convironment.production && config.environment.production.port)
```

now...

```js
var dbPort = field.get(config, 'environment.production.port')
//or if you prefer ':'
dbPort = field.get(config, 'environment:production:port')
```


Installation
------------

    npm install field


Usage
-----

### get


Gets the property value of the object. Returns `undefined` if it does not exist.

```javascript
var field = require('field')
var dbPort = field.get(config, 'environment:production:port')
```

### set


Sets the property value of the object. Returns the old value. If the field does not exist
then it returns `undefined` and creates the object chain and sets the value.

```javascript
var field = require('field')
var database = {}
console.log(field.get(database, 'production.port')) //undefined
field.set(database, 'production.port', 27017) //return undefined since it never existed before
console.log(database.production.port) //27017
```

### your own objects

```js
var field = require('field');

function get (field) {
  return field.get(this, field);
}

function set (field, value) {
  return field.set(this, field, value);
}

var bigObject = {
  host: {
    url: 'http://myserver.com'
  }
  /* 
    ... some big object ... 
  */ 
};

bigObject.get = get.bind(bigObject) //actually 'bind' really isn't necessary, could just do
bigObject.set = set.bind(bigObject) //bigObject.get = get

console.log(bigObject.get('host.url')) //'http://myserver.com'
```



Config Files
------------

Use [fnoc](https://github.com/jprichardson/node-fnoc) or [jsoncfg](https://github.com/jprichardson/node-jsoncfg) which both use this module.


License
-------

(MIT License)

Copyright 2013, JP Richardson  <jprichardson@gmail.com>


