/**
 * Utility for naming a function
 * @param {string} name that the function should have
 * @param {Function} f the actual function
 */
function namedFunc(name, f) {
  Object.defineProperty(f, 'name', { value: name, writable: false })
  return f
}

module.exports = namedFunc