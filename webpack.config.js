const path = require('path')

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: 'build/'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.yaml$/, loader: 'json-loader!yaml-loader' },
      { test: /\.(svg|png|mp3|ogg)$/, loader: 'file-loader' },
    ]
  },
  plugins: [],
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  devtool: 'source-map'
}
