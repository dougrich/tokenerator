const fs = require('fs-extra')
const path = require('path')
const cheerio = require('cheerio')

const SVGO = require('svgo')

async function processFile(filename) {
  const contents = await fs.readFile(filename, 'utf8')
  const $ = cheerio.load(contents)
  const layers = []
  $('g').each((i, e) => {
    const className = e.attribs['class']
    if (className) {
      layers.push(className.toString())
      $(`g.${className} *`).each((i, e) => {
        // pull fill out of style
        let fill = ''
        if (e.attribs['fill']) {
          fill = e.attribs['fill']
        } else if (e.attribs['style']) {
          const style = e.attribs['style']
          const decls = style.split(';')
          for (const decl of decls) {
            if (decl.indexOf('fill:') === 0) {
              fill = decl.slice('fill:'.length)
              e.attribs['style'] = style.replace(decl, '').replace(';;', '').replace(/^\;/gi, '')
              break
            }
          }
        }

        e.attribs['fill'] = '${context[\'' + className + '\'].color}'

      })
    }
  })
  $('svg').attr('class', '')
  const done = $('body').html()
  const svgo = new SVGO({
    plugins: [
      { cleanupAttrs: false }
    ]
  })
  
  try {
    const { data: optimized } = await svgo.optimize(done)
    const properties = {}
    for (const layer of layers) {
      properties[layer] = { '$ref': '#/defs/layer' }
    }
    const id = path.basename(filename).replace('.svg', '')
    return {
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'channels'],
        properties: {
          id: {
            const: id
          },
          channels: {
            type: 'object',
            required: layers,
            additionalProperties: false,
            properties
          }
        }
      },
      template: `"${id}": (context) => \`${optimized}\``
    }
  } catch (err) {
    console.log('ERROR IN ' + filename)
    console.log(err)
  }
}


async function processDirectory() {
  const files = await fs.readdir('./raw')
  
  const contents = await Promise.all(files.map(name => processFile('./raw/' + name)))
  const oneOf = []
  const combinedSchema = {
    type: 'object',
    defs: {
      layer: {
        type: 'object',
        additionalProperties: false,
        required: ['color'],
        properties: {
          color: {
            type: 'string',
            pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
          }
        }
      }
    },
    additionalProperties: false,
    required: ['title', 'description', 'parts'],
    properties: {
      title: { type: 'string', maxLength: 255 },
      description: { type: 'string', maxLength: 4096 },
      private: { type: 'boolean' },
      parts: {
        type: 'array',
        items: {
          oneOf
        }
      }
    }
  }
  const templates = []
  for (const { schema, template } of contents) {
    templates.push(template)
    oneOf.push(schema)
  }

  const js = 'module.exports = {\n  $schema: ' + JSON.stringify(combinedSchema) + ',\n  ' + templates.join(',\n  ') + '\n}'
  fs.writeFile('../api/src/token-parts.js', js)
}

processDirectory()