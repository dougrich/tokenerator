function ImageNegotiationMiddleware(
  getSVG,
  getJSON,
  contentMiddleware = require('./content'),
  express = require('express'),
  { immutable } = require('../cache'),
  { compileMiddleware } = require('../util'),
  rsvg = require('librsvg').Rsvg
) {
  const formatter = {
    'json': async (req, res, next) => {
      res.json(await getJSON(req))
    },
    'svg': compileMiddleware(
      contentMiddleware('image/svg+xml'),
      async (req, res, next) => {
        const svg = await getSVG(req)
        res.setHeader('Cache-Control', immutable)
        res.setHeader('Content-Type', 'image/svg+xml')
        res.end(svg)
      }),
    'png': compileMiddleware(
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
      contentMiddleware('image/png'),
      async (req, res, next) => {
        const svg = await getSVG(req)
        const size = parseInt(req.query.size || '180')
        res.setHeader('Cache-Control', immutable)
        res.setHeader('Content-Disposition', `attachment; filename="${req.params.slug}@${size}.png"`)
        const render = new rsvg()
        render.on('finish', function () {
          const { data } = render.render({
            format: 'png',
            width: size,
            height: size
          })
          res.end(data)
        })
        render.on('error', function () {
          res.status(500)
          res.end()
        })
        render.end(svg)
      })
  }
  return (req, res, next) => {
    const format = req.params.format || 'json'
    formatter[format](req, res, next)
  }
  const router = express()
  router.get(
    `*.json`,
    async (req, res, next) => {
      const json = await getJSON(req)
      res.json(json)
    })

  router.get(
    `*.svg`,
    contentMiddleware('image/svg+xml'),
    async (req, res, next) => {
      const svg = await getSVG(req)
      res.setHeader('Cache-Control', immutable)
      res.setHeader('Content-Type', 'image/svg+xml')
      res.end(svg)
    })

  router.get(
    `*.png`,
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
    contentMiddleware('image/png'),
    async (req, res, next) => {
      const svg = await getSVG(req)
      const size = parseInt(req.query.size || '180')
      res.setHeader('Cache-Control', immutable)
      res.setHeader('Content-Disposition', `attachment; filename="${req.locals.slug}@${size}.png"`)
      const render = new rsvg()
      render.on('finish', function () {
        const { data } = render.render({
          format: 'png',
          width: size,
          height: size
        })
        res.end(data)
      })
      render.on('error', function () {
        res.status(500)
        res.end()
      })
      render.end(svg)
    })

  return router
}

module.exports = ImageNegotiationMiddleware