require('dotenv').config()

module.exports = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    ...(process.env.NODE_ENV === 'test' ? { fast: true} : {})
  }
}
