const fs = require('fs-extra')
const path = require('path')
const cheerio = require('cheerio')

module.exports = async function forEach(fn) {
  const root = path.join(__dirname, '../../parts/raw')
  const files = await fs.readdir(root)
  
  const write = async ($, filename) => {
    const src = $
      .html()
      .replace('<html><head></head><body>', '')
      .replace('</body></html>', '')
    await fs.writeFile(filename, src)
  }
  return await Promise.all(files.map(async (name) => {
    const filename = path.join(root, name)
    const contents = await fs.readFile(filename, 'utf8')
    const id = path.basename(filename).replace('.svg', '')
    const $ = cheerio.load(contents)
    return await fn($, { id }, () => {
      return write($, filename)
    })
  }))
}