var config = require('../config')
var faker = require('faker')

var engine = {
  undefined: require('fakeredis'),
  test: require('fakeredis'),
  production: require('redis'),
  development: require('redis')
}[process.env.NODE_ENV]

var redis = module.exports = engine.createClient(config.redis)

redis.healthCheck = function (cb) {
  var now = Date.now().toString()
  redis.set('!healthCheck', now, function (err) {
    if (err) return cb(err)

    redis.get('!healthCheck', function (err, then) {
      if (err) return cb(err)
      if (now !== then.toString()) return cb(new Error('Redis write failed'))

      cb()
    })
  })
}

function prepareMockDate (count) {
  var data = []
  for(var i = 0; i < count; i++) {
    var contact = {
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      id: i
    }
    data.push(contact)
  }
  redis.set('contacts', JSON.stringify(data))
}

redis.on('connect', () => {
  console.log('redis connected.')

  if(process.env.NODE_ENV === 'development') {
    prepareMockDate(50)
  }
})
