const program = require('commander')
const forEach = require('../forEach')
const unique = (x, i, a) => a.indexOf(x) === i

const aggregateReplace = (name, replace) => {
  return (old, value) => {
    const set = []
    const add = (id) => {
      set.push(id)
    }
    return {
      replace: replace(old, value, add),
      log: () => {
        console.log(`Replacing ${name} values of "${old}" with "${value}"\n\nUpdated:`)
        for (const id of set.filter(unique)) {
          console.log(' - ' + id)
        }
      }
    }
  }
}

const styleField = (e, name, old, value) => {
  const style = e.attribs['style']
  if (!style) {
    return
  }
  const parts = style.split(';')
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].indexOf(name + ':') === 0 && parts[i].replace(name + ':', '').trim() === old) {
      if (value != null) {
        parts[i] = name + ':' + value
      } else {
        parts.splice(i, 1)
        i--
      }
    }
  }
  e.attribs['style'] = parts.join(';')
  return style != e.attribs['style']
}

const attribField = (e, name, old, value) => {
  if (e.attribs[name] !== old) {
    return false
  }

  e.attribs[name] = value
  return true
}

const styleHandlers = (...names) => {
  const set = {}
  for (const n of names) {
    set[n] = aggregateReplace(n, (old, value, add) => ($, { id }, write) => {
      $('*').each((i, e) => {
        const updatedStyle = styleField(e, n, old, value)
        const updatedAttrib = attribField(e, n, old, value)
        if (updatedStyle || updatedAttrib) {
          add(id)
          return write()
        }
      })
    })
  }
  return set
}

const handlers = {
  ...styleHandlers(
    'stroke-width',
    'fill'
  ),
  tag: aggregateReplace('tag', (old, value, add) => ($, { id }, write) => {
    const original = $('svg').attr('data-tags') || ''
    let tags = original.split('+')
    tags = tags.map(x => {
      if (x === old) return value
      else return x
    })
    tags = tags.filter(unique).filter(x => !!x)
    const updated = tags.join('+')
    if (updated != original) {
      $('svg').attr('data-tags', updated)
      add(id)
      return write()
    }
  })
}

program
  .command('replace')
  .description('Replaces one value with another value, returning the impacted ids.')
  .arguments('<name> <old> <value>')
  .usage(`<${Object.keys(handlers).join('|')}> <old> <value>`)
  .action(async function (name, old, value) {
    const handler = handlers[name]

    if (!handler) {
      this.help()
      return
    }

    const { replace, log } = handler(old, value)

    await forEach(replace)
    log()
  })

program
  .command('remove')
  .description('Removes a value, returning the impacted ids.')
  .arguments('<name> <value>')
  .usage(`<${Object.keys(handlers).join('|')}> <value>`)
  .action(async function (name, value) {
    const handler = handlers[name]

    if (!handler) {
      this.help()
      return
    }

    const { replace, log } = handler(value)

    await forEach(replace)
    log()
  })