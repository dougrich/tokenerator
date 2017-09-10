const config = require('./webpack.config.common.js');
const merge = require('webpack-merge');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = merge(config, {
    name: 'server',
    entry: './src/server/index.ts',
    output: {
        filename: 'server.js',
        libraryTarget: 'commonjs2'
    },
    plugins: [
        new webpack.DefinePlugin({
            IS_CLIENT: JSON.stringify(false)
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new NodemonPlugin()
    ],
    externals: [
        nodeExternals({
            whitelist: ['@dougrich/tokenerator']
        })
    ],
    target: 'node'
});