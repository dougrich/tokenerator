const express = require('express')
const token = require('./endpoint/token')
const account = require('./endpoint/account')
const batch = require('./endpoint/batch')
const legacy = require('./endpoint/legacy')
const config = require('./config')

const canonical = {
  token: (id) => `/token/${id}`,
  account: () => `/account`,
  batch: (id) => `/batch/${id}`,
  logout: () => `/logout`,
  browse: `/browse`
}

function app() {
  const instance = express()
  // health check
  instance.get('/', (_, res) => res.status(200).end())
  
  instance.use('/api/token/', token(config.get('buckets:cache'), config.get('account:secret'), canonical))
  instance.use('/api/account/', account(canonical))
  instance.use('/api/batch/', batch(config.get('buckets:batch'), config.get('topics:batch'), canonical))
  instance.use('/api/legacy/', legacy(canonical))
  return instance
}

module.exports = app