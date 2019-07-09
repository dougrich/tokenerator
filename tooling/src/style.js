function parse(style) {
  const segments = style.split(';')
  const map = {}
  for (const s of segments) {
    const [name, value] = s.split(':').map(x => x.trim())
    map[name] = value
  }
  return map
}

function serialize(map) {
  const segments = []
  for (const key in map) {
    const value = map[key]
    if (value != null) {
      segments.push(key + ':' + value)
    }
  }
  return segments.join(';')
}

module.exports = {
  parse,
  serialize
}