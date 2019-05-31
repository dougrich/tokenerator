const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    let { pathname, query } = parsedUrl

    if (pathname.indexOf('/token/') === 0) {
      query['id'] = pathname.slice('/token/'.length)
      pathname = '/token'
      app.render(req, res, pathname, query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3000, err => {
    if (err) throw err
  })
})
