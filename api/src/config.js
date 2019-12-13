const nconf = require('nconf')

nconf.file({
  file: '/run/secrets/tokenerator_config'
})

module.exports = nconf