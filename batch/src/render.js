const PDFDocument = require('pdfkit')
const config = require('./config')

const layout = require('./layout')

function render({ page, name, images, friendly, options }, stream) {
  
  options = {
    withOutline: true,
    withLabels: true,
    ...(options || {})
  }
  
  page = page || 'letter'
  
  name = name || 'Anonymous Batch Set'

  const style = layout.page[page]

  const pdfinfo = config.get('pdf')
  const pdf = new PDFDocument({
    size: page,
    info: {
      ...pdfinfo,
      Title: pdfinfo.Title + ' - ' + name
    }
  })

  pdf.pipe(stream)
  pdf.fontSize(layout.fontsize)

  for (let i in images) {
    const image = images[i]
    const { cx, cy } = style.pos(i)
    if (options.withLabels) {
      pdf
        .text(friendly[i].substring(0, 16), cx - layout.size.outline / 2, cy - layout.size.outline / 2 - layout.weight.medium - layout.fontsize, { align: 'center', width: layout.size.outline })
    }

    if (options.withOutline) {
      pdf
        .circle(cx, cy, layout.size.outline / 2)
        .dash(layout.weight.thin, { space: layout.weight.medium })
        .lineWidth(layout.weight.thin)
        .stroke()
    }
  
    pdf.image(image, cx - layout.size.token / 2, cy - layout.size.token / 2, { width: layout.size.token, height: layout.size.token })
    let isPageBreak = (i % style.max) === 0 && i > 0
    if (isPageBreak) {
      pdf.addPage()
    }
  }

  pdf.end()
}

module.exports = render