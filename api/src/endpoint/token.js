const express = require('express')
const Firestore = require('@google-cloud/firestore')
const parts = require('../token-parts')
const Ajv = require('ajv')
const nanoid = require('nanoid')
const bodyparser = require('body-parser')
const slug = require('slug')
const cookieParser = require('cookie-parser')
const { imageNegotationMiddleware } = require('../middleware')
const ajv = new Ajv()
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))
const validator = ajv.compile(parts.$schema)
const jwt = require('jsonwebtoken')
const { tokenToSvg } = require('../token2svg')
const Cache = require('@dougrich/read-cache')

const TOKEN_COLLECTION = 'tokens/'

const userMiddleware = (secret) => (req, res, next) => {
  if (req.cookies.auth) {
    try {
      req.params.user = jwt.verify(req.cookies.auth, secret)
    } catch (err) {
      res.status(400)
      res.end('Request contains an invalid JWT token; clear cookies and try again')
      return
    }
  }
  next()
}

function loadToken(firestore) {

  // this debounces loading specific tokens
  const fetch = new Cache(async (tokenid) => {
    const tokenDoc = firestore.doc(TOKEN_COLLECTION + tokenid)
    return tokenDoc.get()
  }, 36000, Cache.concat)

  return async (req, res, next) => {
    if (!req.params.tokenid) {
      return next()
    }

    try {
      const token = await fetch(req.params.tokenid)
      if (!token.exists) {
        // 404
        res.status(404)
        res.setHeader('x-error', 'token not found')
        res.end()
        return
      }
      const data = req.params.token = token.data()
      req.params.slug = slug(data.title || 'token')
      res.setHeader('x-token-name', encodeURIComponent(data.title.slice(0, 255)))
      res.setHeader('x-token-slug', req.params.slug)
      next()
    } catch (err) {
      next(err)
    }
  }
}

function validateDecoration(req, res, next) {
  if (!req.query.decor) return next()
  if (!/^[0-9a-zA-Z]$/gi.test(req.query.decor)) {
    return res.status(400).end()
  }
  req.params.decor = req.query.decor
  next()
}

async function setToken(firestore, token) {
  let id = ''
  token.modified = Date.now()
  let collision = false
  do {
    id = nanoid(10)
    const doc = firestore.doc(TOKEN_COLLECTION + id)
    const snapshot = await doc.get()
    collision = snapshot.exists
  } while (collision)
  const doc = firestore.doc(TOKEN_COLLECTION + id)
  token.id = id
  await doc.set(token)
  return id
}

function tokenEndpoint(bucket, secret, canonical) {
  const router = express()
  const firestore = new Firestore()

  const fetch = new Cache(async (user, next) => {
    const size = 60
    let query = firestore.collection('tokens')
    
    query = !!user
      ? query.where('user', '==', user)
      : query.where('private', '==', false)
    
    query = query.orderBy('modified', 'desc')
    if (next) {
      query = query.where('modified', '<=', next)
    }
    query = query
        .limit(size + 1)
        .select('title', 'id', 'modified')

    const snapshots = await query.get()
    const promises = []
    snapshots.forEach(x => {
      promises.push(x.data())
    })
    const documents  = await Promise.all(promises)
    const hasMore = documents.length === (size + 1)
    return ({
      documents: documents.slice(0, size),
      next: hasMore
        ? documents[size].modified
        : false
    })
  }, 36000, Cache.concat)

  router.post(
    '/',
    bodyparser.json(),
    cookieParser(),
    userMiddleware(secret),
    (req, res, next) => {
      const isValid = validator(req.body)
      if (!isValid) {
        res.status(400)
        res.json(validator.errors)
      } else {
        next()
      }
    },
    async (req, res, next) => {
      // populate id, redirect to token
      if (req.params.user) {
        req.body.user = req.params.user.sub
      }
      try {
        const id = await setToken(firestore, req.body)
        res.setHeader('X-Token-Id', id)
        res.redirect(200, canonical.token(id))
      } catch (err) {
        next(err)
      }
    }
  )

  router.get(
    '/',
    cookieParser(),
    userMiddleware(secret),
    (req, res, next) => {
      if (!req.query.next) return next()
      if (!/^[1-9][0-9]*$/.test(req.query.next)) {
        res.status(400)
        res.end("'next' query parameter must be an integer > 0")
        return
      }

      req.params.next = parseInt(req.query.next)
      if (!req.query.filter) return next()
      if (req.query.filter !== 'mine') {
        res.status(400)
        res.end("'filter' query must be 'mine'")
        return
      }
      next()
    },
    async (req, res, next) => {
      const user = !!req.query.filter && !!req.params.user && !!req.params.user.sub
        ? req.params.user.sub
        : null
      

      try {
        const body = await fetch(user, req.params.next)
        res.json(body)
      } catch (err) {
        next(err)
      }
    }
  )

  router.get(
    '/:tokenid.:format',
    loadToken(firestore),
    validateDecoration,
    imageNegotationMiddleware(
      (req) => {
        let svg = tokenToSvg(parts, req.params.token, req.params.decor)
        if (req.query.trim) {
          svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="36.5" fill="transparent" stroke="#${req.query.trim}" stroke-width="17"/>
          ${svg.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '').replace('<svg', '<svg x="22.5" y="22.5" width="45" height="45"')}
        </svg>`
        }
        return svg
      },
      (req) => req.params.token
    )
  )

  return router
}

module.exports = tokenEndpoint