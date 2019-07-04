function tokenToSvg (parts, token, decor) {
  let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">`
  for (const part of token.parts) {
    const template = parts[part.id]
    svg += template(part.channels)
  }
  if (decor != null) {
    svg += '<text x="45" y="80" text-anchor="middle" stroke="black" stroke-width="4.5" fill="black" font-size="50" font-family="monospace">' + decor + '</text>'
    svg += '<text x="45" y="80" text-anchor="middle" fill="white" font-size="50" font-family="monospace">' + decor + '</text>'
  }
  svg += '</svg>'
  return svg
}

module.exports = {
  tokenToSvg
}