
const inch = 72

function calculateCountGutter(length, margin, size, minSize) {
  let count = Math.floor((length - margin * 2) / size) + 1
  let gutter = 0
  while (gutter < minSize) {
    count--
    gutter = (length - margin * 2 - count * size) / (count - 1)
  }
  return {
    count,
    gutter
  }
}

function createGridPosition(width, height, margin, size, minSize) {
  const column = calculateCountGutter(width, margin, size, minSize)
  const row = calculateCountGutter(height, margin, size, minSize)
  const max = column.count * row.count
  return {
    pos: i => {
      i = i % max
      const x = i % column.count
      const y = Math.floor(i / column.count)
      const cx = (margin + size / 2 + x * (size + column.gutter))
      const cy = (margin + size / 2 + y * (size + row.gutter))
      return {
        cx,
        cy
      }
    },
    max
  }
}

const margin = inch / 2
const fontsize = 10
const size = {
  token: 0.8 * inch,
  outline: 1.375 * inch
}

const weight = {
  thin: inch * 0.0125,
  medium: inch * 0.025
}

module.exports = {
  margin,
  size,
  fontsize,
  weight,
  page: {
    letter: createGridPosition(
      8.5 * inch, 11 * inch,
      margin,
      size.outline,
      fontsize + 2 * weight.medium
    ),
    a4: createGridPosition(
      595, 842,
      margin,
      size.outline,
      fontsize + 2 * weight.medium
    )
  }
}