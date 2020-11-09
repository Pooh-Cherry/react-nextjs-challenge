const docPath = 'contacts'
const { promisify } = require('util')

function Contact (redisClient, cb) {
  this.redis = redisClient
  this.callback = cb
  this.setAsync = promisify(this.redis.set).bind(this.redis)
  this.getAsync = promisify(this.redis.get).bind(this.redis)
}

module.exports = Contact

Contact.prototype.all = async function () {
  try {
    return JSON.parse(await this.getAsync(docPath)) || []
  } catch (err) {
    this.callback(err)
    return null
  }
}

Contact.prototype.findById = async function (id) {
  try {
    return (JSON.parse(await this.getAsync(docPath)) || [])[id]
  } catch (err) {
    this.callback(err)
    return null
  }
}

Contact.prototype.addNew = async function (data) {
  try{
    const contacts = JSON.parse(await this.getAsync(docPath)) || []
    await this.setAsync(
      docPath,
      JSON.stringify([...contacts, data])
    )

    return 'OK'
  } catch (err) {
    this.callback(err)
    return 'error'
  }
}

Contact.prototype.update = async function (id, data) {
  try{
    const contacts = JSON.parse(await this.getAsync(docPath)) || []
    contacts[id] = { ...contacts[id], ...data }

    await this.setAsync(
      docPath,
      JSON.stringify(contacts)
    )

    return 'OK'
  } catch (err) {
    this.callback(err)
    return 'error'
  }
}