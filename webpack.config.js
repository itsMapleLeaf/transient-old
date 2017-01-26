const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: 'build/'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.(svg|png|mp3|ogg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]'
        }
      },
    ]
  },
  plugins: [
    new HtmlPlugin({ template: './src/assets/index.html' })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  devtool: 'source-map'
}
