const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  mode: 'production',
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: resolve('dist'),
    filename: 'objectObserver.js',
    library: 'ObjectObserver',
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')]
      },
      {
        test: /\.js$/,
        include: [resolve('src')],
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
