const express = require('express')
const querystring = require('query-string')
const path = require('path')
const Firestore = require('@google-cloud/firestore')
const Ajv = require('ajv')
const shortid = require('shortid')
const config = require('../config')
const axios = require('axios')
const { stalecache } = require('../util')
const jwt = require('jsonwebtoken')

const stale = new stalecache({
  maxAge: 6000
}, async (key) => {
  const response = await axios.get(key)
  return response.data
})

function redirecturi(req) {
  return req.protocol + '://' + req.hostname + path.join(req.baseUrl, 'return')
}

function login(config, provider, secret, canonical) {
  const router = express()

  router.get('/', (req, res, next) => {
    const qs = querystring.stringify({
      client_id: config.id,
      response_type: 'code',
      redirect_uri: redirecturi(req),
      ...config.parameters
    }, {
      arrayFormat: 'comma'
    })
    res.redirect(302, config.href.login + '?' + qs)
  })

  router.get('/return', async (req, res, next) => {
    const code = req.query.code
    const qs = querystring.stringify({
      grant_type: 'authorization_code',
      redirect_uri: redirecturi(req),
      client_id: config.id,
      client_secret: config.secret,
      code
    }, {
      arrayFormat: 'comma'
    })
    try {
      const certificates = await stale.get(config.href.certificates)
      const response = await axios.post(config.href.exchange, qs)
      const { id_token } = response.data
      const verified = await new Promise((resolve, reject) => {
        jwt.verify(id_token, (header, cb) => {
          if (certificates[header.kid]) {
            return cb(null, certificates[header.kid])
          } else if (certificates.keys) {
            for (const key of certificates.keys) {
              if (key.kid === header.kid) {
                return cb(null, `-----BEGIN CERTIFICATE-----\n${key.x5c}\n-----END CERTIFICATE-----\n`)
              }
            }

            return cb(new Error('No keys matched the certificates'))
          } else {
            cb(new Error('No known approach for matching certificates and header'))
          }
        }, (err, value) => {
          if (err) reject(err)
          else resolve(value)
        })
      })

      // form a new JWT for our internal usage
      res.cookie(
        'auth',
        jwt.sign({
          sub: provider + '/' + verified.sub,
          iss: provider,
          name: verified.name
        }, secret),
        {
          expires: new Date(Date.now() + 8.64e+7)
        }
      )

      res.redirect(302, canonical.account())
    } catch (err) {
      next(err)
    }
  })

  return router
}

function accountEndpoint(canonical) {
  const router = express()

  const {
    oauth,
    secret
  } = config.get('account')

  for (const provider in oauth) {
    router.use(
      `/login/${provider}`,
      login(oauth[provider], provider, secret, canonical)
    )
  }

  return router
}

module.exports = accountEndpoint