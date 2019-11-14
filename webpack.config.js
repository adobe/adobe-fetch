const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: './index.js',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'dist'),
    library: '@adobe/fetch',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\/storage.js/, './storageBrowser.js')
  ]
};