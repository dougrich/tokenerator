const path = require('path');
const webpack = require('webpack');

const packDirectory = path.resolve(__dirname, '..', 'dist', 'packed');

module.exports = {
  output: {
    filename: '[name].js',
    path: packDirectory
  },
  plugins: []
};