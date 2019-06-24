const forEach = require('./forEach')
const unique = (x, i, a) => a.indexOf(x) === i
const tagA = process.argv[2]
const tagB = process.argv[3]
console.log(tagA)
console.log(tagB)
if (!tagA || !tagB) {
  console.error('Missing tags')
  process.exit(-1)
}

forEach(($, { id }, write) => {
  const slots = $('svg').attr('data-slots').split('+')
  let tags = ($('svg').attr('data-tags') || '').split('+')
  for (let i = 0; i < tags.length; i++) {
    const parts = tags[i].split('/')
    for (const p of parts) {
      const leaves = p.split(',')
      tags.splice(i, 1, ...leaves)
    }
  }
  for (const slot of slots) {
    tags.push(...slot.split('-'))
  }
  tags = tags.map(x => {
    if (x === tagA) return tagB
    else return x
  })
  tags = tags.filter(unique).filter(x => !!x)
  $('svg').attr('data-tags', tags.join('+'))
  write()
})