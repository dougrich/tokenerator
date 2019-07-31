function compileMiddleware(...middlewares) {
  return (req, res, next) => {
    let i = 0;
    const wrappedNext = (err) => {
      if (err) return next(err)
      i++
      middlewares[i](req, res, wrappedNext)
    }
    middlewares[0](req, res, wrappedNext)
  }
}

module.exports = compileMiddleware