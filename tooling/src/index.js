const program = require('commander')

require('./program')
require('./commands/analysis')
require('./commands/replace')
require('./commands/bundle')
require('./commands/export')

program.parse(process.argv)