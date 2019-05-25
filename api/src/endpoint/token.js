const express = require('express')
const Firestore = require('@google-cloud/firestore')
const svg2img = require('svg2img')
const parts = require('../token-parts')
const Ajv = require('ajv')
const shortid = require('shortid')
const bodyparser = require('body-parser')
const slug = require('slug')
const { cacheMiddleware, contentMiddleware } = require('../middleware')
const ajv = new Ajv()
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))
const validator = ajv.compile(parts.$schema)

const TOKEN_COLLECTION = 'tokens/'

function loadToken(firestore) {
  return async (req, res, next) => {
    if (!req.params.tokenid) {
      return next()
    }

    try {
      const tokenDoc = firestore.doc(TOKEN_COLLECTION + req.params.tokenid)
      const token = await tokenDoc.get()
      if (!token.exists) {
        // 404
        res.status(404).end()
        return
      }
      const data = req.params.token = token.data()
      res.setHeader('x-token-name', data.title.slice(0, 255))
      res.setHeader('x-token-slug', slug(data.title || 'token'))
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
    id = shortid()
    const doc = firestore.doc(TOKEN_COLLECTION + id)
    const snapshot = await doc.get()
    collision = snapshot.exists
  } while (collision)
  const doc = firestore.doc(TOKEN_COLLECTION + id)
  token.id = id
  await doc.set(token)
  return id
}

function tokenToSvg(token, decor) {
  let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">`
  for (const part of token.parts) {
    const template = parts[part.id]
    svg += template(part.channels)
  }
  if (decor != null) {
    svg += '<text x="45" y="80" text-anchor="middle" stroke="black" stroke-width="4.5" fill="black" font-size="50" font-family="monospace">' + decor + '</text>'
    svg += '<text x="45" y="80" text-anchor="middle" fill="white" font-size="50" font-family="monospace">' + decor + '</text>'
  }
  svg += '</svg>'
  return svg
}

function tokenEndpoint(bucket, canonical) {
  const router = express()
  const firestore = new Firestore()

  router.post(
    '/',
    bodyparser.json(),
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
      try {
        const id = await setToken(firestore, req.body)
        res.redirect(303, canonical.token(id))
      } catch (err) {
        next(err)
      }
    }
  )

  router.get(
    '/',
    (req, res, next) => {
      if (!req.query.next) return next()
      if (!/^[1-9][0-9]*$/.test(req.query.next)) {
        res.status(400)
        res.end("'next' query parameter must be an integer > 0")
        return
      }

      req.params.next = parseInt(req.query.next)
      next()
    },
    async (req, res, next) => {
      const size = 20

      let query = firestore.collection('tokens')
        .where('private', '==', false)
        .orderBy('modified', 'desc')

      if (req.params.next) {
        query = query
          .where('modified', '<=', req.params.next)
      }

      query = query
        .limit(size + 1)
        .select('title', 'id', 'modified')

      try {
        const snapshots = await query.get()
        const promises = []
        snapshots.forEach(x => {
          promises.push(x.data())
        })
        const documents  = await Promise.all(promises)
        const hasMore = documents.length === (size + 1)
        res.json({
          documents: documents.slice(0, size),
          next: hasMore
            ? documents[size].modified
            : false
        })
      } catch (err) {
        next(err)
      }
    }
  )

  router.get(
    '/:tokenid.json',
    loadToken(firestore),
    (req, res) => {
      res.json(req.params.token)
    }
  )

  router.get(
    '/:tokenid.svg',
    loadToken(firestore),
    validateDecoration,
    contentMiddleware('image/svg+xml'),
    (req, res, next) => {
      req.params.id = req.params.tokenid + '@' + (req.params.decor || 'default') + '.svg'
      next()
    },
    // cacheMiddleware(bucket, 'immutable, max-age=86400'),
    (req, res) => {
      // flatten it
      res.setHeader('Content-Type', 'image/svg+xml')
      const svg = tokenToSvg(req.params.token, req.params.decor)
      res.end(svg)
    }
  )

  router.get(
    '/:tokenid.png',
    (req, res, next) => {
      if (!req.query.size) {
        req.query.size = '180'
      } else {
        let number = parseInt(req.query.size)
        if (!/^[1-9][0-9]*$/.test(req.query.size) || Number.isNaN(number) || number < 15 || number > 1800) {
          res.status(400)
          res.end()
          return
        }
      }
      next()
    },
    loadToken(firestore),
    validateDecoration,
    contentMiddleware('image/png'),
    (req, res, next) => {
      req.params.id = req.params.tokenid + '@' + req.query.size + '@' + (req.params.decor || 'default') + '.png'
      next()
    },
    // cacheMiddleware(bucket, 'immutable, max-age=86400'),
    (req, res, next) => {
      const svg = tokenToSvg(req.params.token, req.params.decor)
      const size = parseInt(req.query.size || '180')
      svg2img(svg,{format:'png', width: size, height: size}, (err, result) => {
        if (err) return next(err)
        res.end(result)
      })
    }
  )

  return router
}

module.exports = tokenEndpoint