const express = require('express')
const querystring = require('query-string')
const path = require('path')
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

function login(config, provider, secret, canonical, responseHandler) {
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
    await responseHandler(config, provider, secret, canonical, req, res, next)
  })

  return router
}

function signResponse(res, secret, provider, id, name) {
  res.cookie(
    'auth',
    jwt.sign({
      sub: provider + '/' + id,
      iss: provider,
      name
    }, secret),
    {
      expires: new Date(Date.now() + 8.64e+7)
    }
  )
}

async function standardHandler(config, provider, secret, canonical, req, res, next) {
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
    signResponse(res, secret, provider, verified.sub, verified.name)

    res.redirect(302, canonical.account())
  } catch (err) {
    next(err)
  }
}

async function redditHandler(config, provider, secret, canonical, req, res, next) {
  const code = req.query.code
  const qs = querystring.stringify({
    grant_type: 'authorization_code',
    redirect_uri: redirecturi(req),
    code
  }, {
    arrayFormat: 'comma'
  })
  try {
    /**
     * This flow differs from the standard flow in the following ways:
     * - exchanging auth code for access token requires basic authentication with id/secret
     * - no id_token returned from exchange; instead of verifying the JWT in the id_token, fetch the profile
     * - profile name needs syntactic sugar to match expectations
     */
    const response = await axios.post(config.href.exchange, qs, {
      auth: {
        username: config.id,
        password: config.secret
      }
    })
    const { token_type, access_token } = response.data
    const profile = await axios.get('https://oauth.reddit.com/api/v1/me', {
      headers: {
        Authorization: [token_type, access_token].join(' '),
        'User-Agent': config.useragent
      }
    })

    // form a new JWT for our internal usage
    signResponse(res, secret, provider, profile.id, '/u/' + profile.name)

    res.redirect(302, canonical.account())
  } catch (err) {
    next(err)
  }
}

function accountEndpoint(canonical) {
  const router = express()

  const {
    oauth,
    secret
  } = config.get('account')

  const handlers = {
    reddit: redditHandler
  }

  for (const provider in oauth) {
    router.use(
      `/login/${provider}`,
      login(oauth[provider], provider, secret, canonical, handlers[provider] || standardHandler)
    )
  }

  router.use(
    `/logout`,
    (req, res, next) => {
      res.clearCookie('auth')
      res.redirect(302, canonical.logout())
    }
  )

  return router
}

module.exports = accountEndpoint