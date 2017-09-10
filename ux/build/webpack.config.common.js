const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const packDirectory = path.resolve(__dirname, '..', 'dist', 'packed');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader?configFileName=./build/tsconfig.json'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'typings-for-css-modules-loader?modules&namedExport&camelCase&importLoaders=1&localIdentName=[name]-[hash:base64:5]'
          }, {
            loader: 'sass-loader?outputStyle=compressed'
          }]
        })
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  output: {
    path: packDirectory
  },
  plugins: [
    new CheckerPlugin(),
    new ExtractTextPlugin('theme.css')
  ]
};