const { PubSub } = require('@google-cloud/pubsub')
const { Storage } = require('@google-cloud/storage')
const express = require('express')
const Ajv = require('ajv')
const shortid = require('shortid')
const bodyparser = require('body-parser')
const slug = require('slug')

const ajv = new Ajv()
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))
const validator = ajv.compile({
  type: 'object',
  additionalProperties: false,
  required: ['type', 'params', 'tokens'],
  properties: {
    type: {
      oneOf: [
        { const: 'ZIP' },
        { const: 'PDF' }
      ]
    },
    params: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: {
          type: 'string',
          maxLength: 255
        },
        page: {
          oneOf: [
            { const: 'letter' },
            { const: 'a4' }
          ]
        },
        size: {
          type: 'integer',
          minimum: 15,
          maximum: 1800
        },
        options: {
          type: 'object',
          additionalProperties: false,
          properties: {
            withOutline: { type: 'boolean' },
            withLabels: { type: 'boolean' }
          }
        }
      }
    },
    tokens: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id'],
        properties: {
          id: { type: 'string', maxLength: 255 },
          count: { type: 'integer', minimum: 1, maximum: 30 },
          label: {
            oneOf: [
              { const: 'alphabet' },
              { const: 'number' },
              { const: 'none' }
            ]
          }
        }
      }
    }
  }
})

function loadBatch(bucket) {
  return async function (req, res, next) {
    try {
      const { batchid } = req.params
      const requestFile = bucket.file(batchid + '.batch.json')
      const exists = await requestFile.exists()
      if (!exists) {
        res.status(404)
        res.end()
        return
      }

      const body = await requestFile.download()
      const request = JSON.parse(body.toString())
      const resultFile = bucket.file(request.result)
      const resultDone = await resultFile.exists()
      if (!resultDone) {
        req.params.result = ''
        res.status(202)
      } else {
        req.params.result = resultFile
        res.status(200)
      }
      const filename = 'batch_' + slug(request.name || 'tokens') + '.' + request.type.toLowerCase()
      res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"')
      res.setHeader('Content-Type', {
        'PDF': 'application/pdf',
        'ZIP': 'application/zip'
      }[request.type])
      next()
    } catch (err) {
      next(err)
    }
  }
}

function batch(bucketName, topic, canonical) {
  const router = express()
  const storage = new Storage().bucket(bucketName)
  const publisher = new PubSub().topic(topic)

  router.post('/', bodyparser.json(), async (req, res, next) => {
    const isValid = validator(req.body)
    if (!isValid) {
      res.status(400)
      res.end()
      return
    }

    const request = {
      result: shortid() + '.' + req.body.type.toLowerCase(),
      type: req.body.type,
      params: {
        ...req.body.params,
        tokens: req.body.tokens
      }
    }
    const batchid = shortid()
    const storedname = batchid + '.batch.json'

    try {
      await storage.file(storedname).save(JSON.stringify(request))
    } catch (err) {
      return next(err)
    }

    // created, now publish the event
    await publisher.publish(Buffer.from(storedname))
    res.status(201)
    res.setHeader('Location', canonical.batch(batchid))
    res.end()
  })



  router.head('/:batchid', loadBatch(storage), async (req, res, next) => {
    res.end()
  })

  router.get('/:batchid', loadBatch(storage), async (req, res, next) => {
    if (req.params.result) {
      req.params.result.createReadStream().pipe(res)
    } else {
      res.end()
    }
  })

  return router
}

module.exports = batch