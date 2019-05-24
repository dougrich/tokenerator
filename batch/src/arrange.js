const axios = require('axios')
const fs = require('fs')
const path = require('path')
const querystring = require('querystring')

const chars = {
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  number: '123456789',
  none: ' '
}

const noop = () => {}

async function arrange(
  {
    canonical
  }, 
  root,
  size,
  request
) {
  const { tokens } = request
  const images = []
  const friendly = []
  const cachedFetches = {}
  const friendlyConflict = {}
  await Promise.all(tokens.map(async (params) => {
    let { id, count, label } = params
    count = count || 1
    label = label || 'none'
    const fetches = []

    for (let i = 0; i < count; i++) {

      const charset = chars[label]
      const decor = charset[i % charset.length].trim() || 'default'
      const url = canonical.token(id) + '?' + querystring.stringify({
        size,
        decor: decor === 'default' ? undefined : decor
      })
      const filename = path.resolve(root, id + '@500@' + decor + '.png')
      images.push(filename)
      const friendlyIdx = friendly.length
      friendly.push('')
      const fetchOp = cachedFetches[filename] || (cachedFetches[filename] = axios({
        method: 'get',
        url,
        responseType: 'stream'
      }))


      fetches.push(
        fetchOp.then(response => {
          const slug = response.headers['x-token-slug'] || 'token'
          const names = friendlyConflict[slug] || (friendlyConflict[slug] = [])
          names.push(friendlyIdx)
          return new Promise((resolve, reject) => {
            const fd = fs.createWriteStream(filename)
            fd.on('close', () => {
              resolve()
            })
            fd.on('error', (error) => {
              reject(error)
              resolve = noop
            })
            response.data.pipe(fd)
          })
        }))
    }

    await Promise.all(fetches)

    // create slugs for everything
    for (const slug in friendlyConflict) {
      const indicies = friendlyConflict[slug]
      if (indicies.length === 1) {
        friendly[indicies[0]] = slug
      } else {
        indicies.sort()
        for (let i = 0; i < indicies.length; i++) {
          friendly[indicies[i]] = slug + '_' + i.toString()
        }
      }
    }
  }))

  return {
    ...request,
    images,
    friendly
  }
}

module.exports = arrange