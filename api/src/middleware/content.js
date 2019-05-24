function contentMiddleware(type) {
  return (req, res, next) => {
    res.setHeader('Content-Type', type)
    next()
  }
}

module.exports = contentMiddleware