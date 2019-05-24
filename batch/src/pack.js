const archiver = require('archiver')
const fs = require('fs')

function pack({ images, friendly }, stream) {
  const archive = archiver('zip', { zlib: { level: 9 } })
  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve()
    })
    archive.on('error', err => {
      reject(err)
      resolve = () => {}
    })
    archive.pipe(stream)

    for (const i in images) {
      archive.append(fs.createReadStream(images[i]), { name: `${friendly[i]}.png` })
    }
    archive.finalize()
  })
}

module.exports = pack