var sendJson = require('send-data/json')
var body = require('body/json')
var redis = require('./redis')
var Contact = require('./contacts')

const conn = new Contact(redis, redis.print)

exports.index = async function(req, res) {
  const data = await conn.all()
  return sendJson(req, res, { data })
}

exports.query = async function(req, res, opts) {
  var contacts = await conn.all()

  /*
  Object.keys(opts.query).forEach(k => {
    if (k === 'page') return
    if (k === 'per_page') return

    contacts = contacts.filter(contact => contact[k].includes(opts.query[k]))
  })
  */
 if (opts.query.search) {
  contacts = contacts.filter(
    contact => contact.name.includes(opts.query.search) || contact.phone.includes(opts.query.search)
  )
 }

  const current_page = !opts.query.page ? 1 : parseInt(opts.query.page)
  const per_page = !opts.query.per_page ? 20 : parseInt(opts.query.per_page)
  const last_page = Math.ceil(contacts.length / per_page)
  const total_count = contacts.length

  return sendJson(
    req, 
    res, 
    { 
      total_count,
      current_page,
      per_page,
      last_page,
      data: contacts.slice(per_page * (current_page-1), per_page * current_page) 
    }
  )
}

exports.create = function(req, res, opts, cb) {
  body(req, res, async function (err, data) {
    if (err) return cb(err)

    const result  = await conn.addNew(data)
    sendJson(req, res, { result })
  })
}

exports.update = function(req, res, opts, cb) {
  body(req, res, async function (err, data) {
    if (err) return cb(err)

    const result = await conn.update(opts.params.id, data)
    sendJson(req, res, { result })
  })
}

exports.show = async function(req, res, opts, cb) {
  const data = await conn.findById(parseInt(opts.params.id))
  sendJson(req, res, { data })
}
