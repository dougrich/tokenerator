function tokenToSvg (parts, token, decor) {
  let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
<defs>
  <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
    <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 100 -10" result="goo" />
    <feBlend in="SourceGraphic" in2="goo" />
  </filter>
</defs><g filter="url(#f1)">`
  for (const part of token.parts) {
    const template = parts[part.id]
    svg += template(part.channels)
  }
  if (decor != null) {
    svg += '<text x="45" y="80" text-anchor="middle" stroke="black" stroke-width="4.5" fill="black" font-size="50" font-family="monospace">' + decor + '</text>'
    svg += '<text x="45" y="80" text-anchor="middle" fill="white" font-size="50" font-family="monospace">' + decor + '</text>'
  }
  svg += '</g></svg>'
  return svg
}

module.exports = {
  tokenToSvg
}
