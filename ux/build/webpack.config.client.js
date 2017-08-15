const config = require('./webpack.config.js');
const webpack = require('webpack');

const debug = process.argv.indexOf('--debug') >= 0;

config.name = 'c';
config.entry = './dist/src/client/index.js';
config.output.filename = 'client.js';
config.plugins.push(new webpack.DefinePlugin({
    IS_CLIENT: JSON.stringify(true)
}));
if (!debug) {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }));
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;