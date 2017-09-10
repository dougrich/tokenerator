const config = require('./webpack.config.common.js');
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(config, {
  name: 'client',
  entry: './src/client/index.tsx',
  output: {
    filename: 'client.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_CLIENT: JSON.stringify(true),
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
});