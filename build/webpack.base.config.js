const path = require('path') 

const vueConfig = require('./vue-loader.config')

module.exports = {
  devtool: '#source-map',
  entry: {
    app: './client/src/app.js',
    vendor: [  
      'vue',
      'vue-router',
      'whatwg-fetch'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../client/dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  resolve: {
    alias: {
      'public': path.resolve(__dirname, '../client/public')
    }
  },
  module: {
    //noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      }   
    ]
  }
}
