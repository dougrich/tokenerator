const program = require('commander')
const forEach = require('../forEach')
const unique = (x, i, a) => a.indexOf(x) === i

const aggregationHandler = (name, analyze) => {
  return () => {
    const set = {}
    const add = (value, id) => {
      if (value != null) {
        const subset = set[value] || []
        subset.push(id)
        set[value] = subset.filter(unique)
      }
    }
    return {
      analyze: analyze(add),
      log: () => {
        console.log(`${name}:`)
        for (const key in set) {
          console.log()
          console.log('  ' + key + ': ' + set[key].length)
          for (const id of set[key]) {
            console.log('   - ' + id)
          }
        }
      }
    }
  }
}

const styleField = (e, name) => {
  const style = e.attribs['style']
  if (style) {
    const parts = style.split(';')
    for (const part of parts) {
      if (part.indexOf(name + ':') === 0) {
        return part.replace(name + ':', '').trim()
      }
    }
  }

  return null
}

const styleHandlers = (...names) => {
  const set = {}
  for (const n of names) {
    set[n] = aggregationHandler(n, add => ($, { id }) => {
      $('*').each((i, e) => {
        add(styleField(e, n), id)
        add(e.attribs[n], id)
      })
    })
  }
  return set
}

const handlers = {
  ...styleHandlers(
    'stroke-width',
    'fill',
    'mask'
  ),
  tag: aggregationHandler('tag', add => ($, { id }) => {
    let tags = ($('svg').attr('data-tags') || '').split('+')
    for (const t of tags) {
      add(t, id)
    }
  })
}

program
  .command('analyze')
  .description('Analyze an aspect of the token parts. Immutable.')
  .arguments('<name>')
  .usage(`<${Object.keys(handlers).join('|')}>`)
  .action(async function (name) {
    const handler = handlers[name]

    if (!handler) {
      this.help()
      return
    }

    const { analyze, log } = handler()

    await forEach(analyze)
    log()
  })