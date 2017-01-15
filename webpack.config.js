const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.png$/, loader: 'file-loader' },
    ]
  },
  plugins: [
    new HtmlPlugin({ template: './src/index.html' })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  devtool: 'source-map'
}
