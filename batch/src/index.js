const { PubSub } = require('@google-cloud/pubsub')
const { Storage } = require('@google-cloud/storage')
const tmp = require('tmp')
const config = require('./config')

const renderPDF = require('./render')
const packZIP = require('./pack')
const arrange = require('./arrange')

const pubsub = new PubSub()
const subscription = pubsub.subscription(config.get('subscription:batch'))
const storage = new Storage()


function handler(config) {
  return function (op) {
    return function handle(request, output) {
      return new Promise((resolve, reject) => {
        tmp.dir(async (err, root, cleanup) => {
          if (err) return reject(err)
          try {
            const details = await arrange(config, root, request.size || 500, request)
            await op(details, output)
            resolve()
          } catch (err) {
            reject(err)
          } finally {
            cleanup()
          }
        })
      })
    }
  }
}

const handlerFactory = handler({
  canonical: {
    token: id => `http://api/api/token/${id}.png`,
  }
})

const handlers = {
  'PDF': handlerFactory(renderPDF),
  'ZIP': handlerFactory(packZIP)
}

const bucket = config.get('buckets:batch')

subscription.on('message', async message => {
  try {
    const id = message.data
    // go download the file from google storage
    const file = storage.bucket(bucket).file(id.toString())
    const body = await file.download()
    const request = JSON.parse(body.toString())
    const output = storage.bucket(bucket).file(request.result).createWriteStream()
    await handlers[request.type](request.params, output)
    message.ack()
  } catch (err) {
    message.ack()
    // report on the error
    console.error(err)
  }
})