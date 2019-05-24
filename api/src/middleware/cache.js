const { namedFunc, wrapFunc } = require('../util')
const { Storage } = require('@google-cloud/storage')

/**
 * The cacheMiddleware caches the result of the API call in google storage, opting to serve it instead of actually continuing if it exists
 * This is useful for horizontally scaling caches
 * @param {string} bucket GCS bucket name
 * @param {string} cacheControl specific cache control header to add
 */
function cacheMiddleware(
  bucket,
  cacheControl
) {
  const store = new Storage().bucket(bucket)
  return namedFunc(`middlware/cache - ${bucket}`, async (req, res, next) => {
    const id = req.params.id || 'default'
    const file = store.file(id)
    try {
      res.setHeader('Cache-Control', cacheControl)
      const [exists] = await file.exists()
      if (exists) {
        res.status(200)
        const read = file.createReadStream()
        read.pipe(res)
      } else {

        const save = file.createWriteStream()

        wrapFunc(res, 'end', actual => (data, cb) => {
          save.end(data, (err) => {
            if (err) {
              if (cb) {
                cb(err)
              }
            } else {
              actual(data, cb)
            }
          })
        })
      
        next()
      }
    } catch (err) {
      next(err)
    }
  })
}

module.exports = cacheMiddleware