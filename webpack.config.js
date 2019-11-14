const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: './src/client.js',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\/storage.js/, './storageBrowser.js')
  ]
};