class StaleCache {
  constructor({
    maxAge
  }, fetch) {
    this.fetch = fetch
    this.maxAge = maxAge
    this.data = {}
  }

  get(key) {
    if (!this.data[key] || (Date.now() - this.data[key].age) > this.maxAge) {
      this.data[key] = {
        age: Date.now(),
        value: this.fetch(key)
      }
    }

    return this.data[key].value
  }
}

module.exports = StaleCache