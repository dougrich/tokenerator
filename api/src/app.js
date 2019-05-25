const express = require('express')
const token = require('./endpoint/token')
const account = require('./endpoint/account')
const batch = require('./endpoint/batch')
const config = require('./config')

const canonical = {
  token: (id) => `/token/${id}`,
  account: () => `/account`,
  batch: (id) => `/batch/${id}`
}

function app() {
  const instance = express()
  instance.use('/api/token/', token(config.get('buckets:cache'), canonical))
  instance.use('/api/account/', account(canonical))
  instance.use('/api/batch/', batch(config.get('buckets:batch'), config.get('topics:batch'), canonical))
  return instance
}

module.exports = app