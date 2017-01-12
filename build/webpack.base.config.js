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
    ],
    appWithStore:'./client_1227/src/app.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    alias: {
      'public': path.resolve(__dirname, '../dist')
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
