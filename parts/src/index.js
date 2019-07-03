const program = require('commander')

require('./program')
require('./commands/analysis')
require('./commands/replace')
require('./commands/bundle')

program.parse(process.argv)