// okay so the idea is to have a placeholder
// /api/placeholder.svg?style=hatched&color=D00name=tyrinnicus
const express = require('express')
const fs = require('fs')
const path = require('path')
const { imageNegotationMiddleware } = require('../middleware')
const placeholderImages = {
  'hatched': fs.readFileSync(path.resolve(__dirname, './placeholder-images/hatched.svg'))
}

const style = {
  'hatched': (label, color) => `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
  <circle cx="45" cy="45" r="45" fill="${color}"/>
  <circle cx="45" cy="45" r="34" fill="black"/>
  <circle cx="45" cy="45" r="30" fill="black" stroke="${color}" stroke-width="3.1"/>
  <circle cx="45" cy="45" r="29" fill="white" stroke="black" stroke-width="1.1"/>
  ${placeholderImages.hatched}
  <rect x="0" y="39" width="90" height="12" fill="black"/>
  <text x="45" y="48.5" text-anchor="middle" font-size="10" font-family="Roboto Slab" font-weight="900" fill="#FFF">${label.substring(0, 10)}</text>
</svg>`,
  'flat': (label, color) => `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
  <circle cx="45" cy="45" r="45" fill="black"/>
  <circle cx="45" cy="45" r="34" fill="${color}"/>
  <rect x="0" y="39" width="90" height="12" fill="black"/>
  <text x="45" y="48.5" text-anchor="middle" font-size="10" font-family="Roboto Slab" font-weight="900" fill="white">${label.substring(0, 10)}</text>
</svg>`,
  'direct': (label, color) => `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
  <circle cx="45" cy="45" r="45" fill="${color}"/>
  <text x="45" y="55" text-anchor="middle" font-size="30" font-family="Roboto Slab" font-weight="900" fill="black" stroke-width="3.5" stroke="black">${label[0]}</text>
  ${'69'.indexOf(label[0]) >= 0 ? '<rect x="40" y="57" width="10" height="4" fill="white" stroke="black" stroke-width="1.5"/>': ''}
  <text x="45" y="55" text-anchor="middle" font-size="30" font-family="Roboto Slab" font-weight="900" fill="white">${label[0]}</text>
</svg>`,
  'trim': (_, color) => `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
  <circle cx="45" cy="45" r="36.5" fill="transparent" stroke="${color}" stroke-width="17"/>
</svg>`
}

function placeholderEndpoint() {
  const router = express()
  router.use(
    '/:style.:format',
    (req, res, next) => {
      if (!req.query.color) {
        return res.status(400).end()
      }
      if (!/^[0-9a-f]{3,6}$/gi.test(req.query.color)) {
        return res.status(400).end()
      }
      if (!style[req.params.style]) {
        return res.status(400).end()
      }
      next()
    },
    (req, res, next) => {
      req.params.slug = 'placeholder'
      next()
    },
    imageNegotationMiddleware(
      (req) => {
        return style[req.params.style](req.query.label || ' ', '#' + req.query.color)
      },
      (req) => {
        return {
          style: req.params.style,
          label: req.query.label || '',
          color: '#' + req.query.color
        }
      }
    )
  )
  return router
}

module.exports = placeholderEndpoint