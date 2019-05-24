/**
 * wrapFunc wraps a function on an object. good for spoofing and spying
 * @param {Object} obj is the object
 * @param {string} property name of the property
 * @param {Function} fn that takes a single argument, the actual underlying function, and returns a function to be called in it's place
 */
function wrapFunc(obj, property, fn) {
  const actual = obj[property].bind(obj)
  const spy = fn(actual)
  obj[property] = spy
}

module.exports = wrapFunc