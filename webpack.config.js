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
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.yaml$/, loader: 'json-loader!yaml-loader' },
      { test: /\.(png|mp3|ogg)$/, loader: 'file-loader' },
    ]
  },
  plugins: [
    new HtmlPlugin({ template: './index.html' })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  devtool: 'source-map'
}
