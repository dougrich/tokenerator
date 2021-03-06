const fs = require('fs-extra')
const nanoid = require('nanoid')
const forEach = require('../forEach')
const program = require('commander')
const style = require('../style')

const SVGO = require('svgo')

function parseZ(z) {
  if (!z) {
    return 0
  } else {
    const attempt = parseInt(z)
    if (Number.isNaN(attempt)) {
      throw new Error('Invalid z-index')
    } else {
      return attempt
    }
  }
}

function parseSlots(slots) {
  if (!slots) return []
  return slots.split('+').map(x => ({
    'body': 1 << 0,
    'clothing': 1 << 1,
    'jacket': 1 << 2,
    'tails': 1 << 3,
    'ear': 1 << 4,
    'back': 1 << 5,
    'face': 1 << 6,
    'facial-hair': 1 << 7,
    'hair': 1 << 8,
    'hat': 1 << 9,
    'left-weapon': 1 << 10,
    'right-weapon': 1 << 11,
    'collar': 1 << 12,
    'pauldron': 1 << 13,
    'eyes': 1 << 14,
    'glasses': 1 << 15,
    'decal': 1 << 16,
  }[x] || 0)).reduce((a, b) => a | b, 0)
}

function parseTags(tags) {
  if (!tags) return []
  const each = tags.split('+')
  return each.filter((x, i, a) => a.indexOf(x) === i)
}

async function processFile($, { id }, filename) {
  const layers = []
  const svg = $('svg')
  const tags = parseTags(svg.attr('data-tags'))
  const defaults = {
    z: parseZ(svg.attr('data-z')),
    slots: parseSlots(svg.attr('data-slots')),
    channels: {}
  }
  svg.attr('data-z', '')
  svg.attr('data-slots', '')
  $('g').each((i, e) => {
    const className = e.attribs['class']
    if (className) {
      layers.push(className.toString())
      $(`g.${className} *`).each((i, e) => {
        // pull fill out of style
        if (e.attribs['class'] === 'ignored' || e.tagName === 'g') return

        let fill = ''
        if (e.attribs['fill']) {
          fill = e.attribs['fill']
        } else if (e.attribs['style']) {
          const stylemap = style.parse(e.attribs['style'])
          if (stylemap['fill']) {
            fill = stylemap['fill']
            if (fill === 'none') return
            delete stylemap['fill']
            e.attribs['style'] = style.serialize(stylemap)
          }
        }

        if (fill === 'none') return

        defaults.channels[className] = { color: fill }
        e.attribs['fill'] = '${get(context, \'' + className + '\', \'' + fill + '\')}'
        e.attribs['data-layer'] = `${id}/${className}`
      })
    }
  })
  $('svg').attr('class', '')
  const done = $('body').html()
  const svgo = new SVGO({
    plugins: [
      { cleanupAttrs: false },
      {
        cleanupIDs: {
          remove: true,
          minify: true,
          prefix: 'd-' + nanoid(5) + '-'
        }
      }
    ]
  })
  
  try {
    const { data: optimized } = await svgo.optimize(done)
    const properties = {}
    for (const layer of layers) {
      properties[layer] = { '$ref': '#/defs/layer' }
    }
    return {
      id,
      defaults,
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
      tags,
      template: `"${id}": (context) => \`${optimized}\``
    }
  } catch (err) {
    console.log('ERROR IN ' + filename)
    console.log(err)
  }
}


async function processDirectory() {  
  const contents = await forEach(processFile)
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
  const allDefaults = {}
  const allTags = {}
  const templates = []
  for (const { schema, template, defaults, tags, id } of contents) {
    templates.push(template)
    allDefaults[id] = defaults
    oneOf.push(schema)
    for (const t of tags) {
      const set = allTags[t] || []
      set.push(id)
      allTags[t] = set
    }
  }

  allTags['$list'] = Object.keys(allTags).sort()

  const moduleExports = {
    '$schema': combinedSchema,
    '$defaults': allDefaults,
    '$tags': allTags
  }

  function get(context, key, fallback) {
    return !!context[key]
      ? context[key].color || fallback
      : fallback
  }

  const js = get.toString() + '\n\nmodule.exports = ' + JSON.stringify(moduleExports).slice(0, -1) + ',\n  ' + templates.join(',\n  ') + '\n}'
  fs.writeFile('../api/src/token-parts.js', js)
  fs.writeFile('../ux/src/token-parts.js', js)
}

program
  .command('bundle')
  .description('bundles and writes the token-parts files')
  .action(processDirectory)