const handler = require('./handlerFactory')
const fs = require('fs')
const config = require('./config')
const path = require('path')

config.set('pdf', {
  Title: 'test'
})

handler({}, () => {
  return {
    page: 'letter',
    name: 'test',
    images: [
      path.resolve(__dirname, '../test/Demon-Brain@500.png')
    ],
    friendly: [
      '________________'
    ]
  }
})(require('./render'))(
  {},
  fs.createWriteStream('example.pdf')
)