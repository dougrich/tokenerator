module.exports = function handler(
  config,
  arrange = require('./arrange'),
  tmp = require('tmp')
) {
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