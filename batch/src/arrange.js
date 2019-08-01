const axios = require('axios')
const fs = require('fs')
const path = require('path')
const querystring = require('querystring')
const layout = require('./layout')

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
  const sizes = []
  const friendly = []
  const cachedFetches = {}
  const fetch = (filename, url) => cachedFetches[filename] || (cachedFetches[filename] = axios({
    method: 'get',
    url,
    responseType: 'stream'
  }).then(response => {
    return new Promise((resolve, reject) => {
      const fd = fs.createWriteStream(filename)
      fd.on('close', () => {
        resolve(response)
      })
      fd.on('error', (error) => {
        reject(error)
        resolve = noop
      })
      response.data.pipe(fd)
    })
  }))
  const friendlyConflict = {}
  await Promise.all(tokens.map(async (params) => {
    let { id, count, placeholder, trim, placeholderName, label } = params
    count = count || 1
    label = label || 'none'
    const fetches = []

    for (let i = 0; i < count; i++) {

      if (id) {
        const charset = chars[label]
        const decor = charset[i % charset.length].trim() || 'default'
        const url = canonical.token(id) + '?' + querystring.stringify({
          size,
          decor: decor === 'default' ? undefined : decor,
          trim
        })

        const filename = path.resolve(root, id + '@' + decor + '.png')
        images.push(filename)
        const friendlyIdx = friendly.length
        friendly.push('')
        const fetchOp = fetch(filename, url)
        fetches.push(fetchOp.then(response => {
          const slug = response.headers['x-token-slug'] || 'token'
          const names = friendlyConflict[slug] || (friendlyConflict[slug] = [])
          names.push(friendlyIdx)
        }))
        sizes.push(trim ? layout.size.outline : layout.size.token)
      }

      if (placeholder) {
        const charset = chars[label]
        const decor = placeholderName || charset[i % charset.length].trim() || undefined
        const color = trim || 'FFF'
        const url = canonical.placeholder(placeholder) + '?' + querystring.stringify({
          size,
          label: decor,
          color
        })

        const filename = path.resolve(root, placeholder + '@' + color + '@' + decor + '.png')
        images.push(filename)
        const fetchOp = fetch(filename, url)
        const slug = placeholderName || placeholder
        const names = friendlyConflict[slug] || (friendlyConflict[slug] = [])
        names.push(friendly.length)
        friendly.push('')
        sizes.push(layout.size.outline)
        fetches.push(fetchOp)
      }
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
    sizes,
    friendly
  }
}

module.exports = arrange