const config = require('./webpack.config.js');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

config.name = 's';
config.entry = './dist/src/server/index.js';
config.output.filename = 'server.js';
// config.plugins.push(new webpack.optimize.UglifyJsPlugin());
config.externals = {
    'http': 'http',
    'url': 'url',
    'fs': 'fs',
    'zlib': 'zlib',
    'react': 'react',
    'react-dom/server': 'react-dom/server',
    'pino': 'pino',
    'os': 'os',
    'react-router': 'react-router',
    'react-router-dom': 'react-router-dom',
    'react-transition-group': 'react-transition-group',
    'react-router-transition': 'react-router-transition',
    'crypto': 'crypto'
};
config.output.libraryTarget = 'commonjs2';
config.node = {
    process: false,
    Buffer: false
}
config.plugins.push(new webpack.DefinePlugin({
    IS_CLIENT: JSON.stringify(false)
}));

module.exports = config;