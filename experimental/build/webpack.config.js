const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/bootstrap.tsx',
  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'client.js'
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader?configFileName=./build/tsconfig.json'
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader?sourceMap'
        }, {
          loader: 'typings-for-css-modules-loader?modules&namedExport&camelCase&importLoaders=1&localIdentName=[name]-[hash:base64:5]'
        }, {
          loader: 'sass-loader'
        }]
      }
    ]
  },
  plugins: [
      new HtmlWebpackPlugin({
        title: 'Development'
      }),
      new CheckerPlugin()
  ]
};