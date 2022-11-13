const common = require('./webpack.common.js');
const {merge} = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  module:{
    rules:[
      {
        test: /\.(scss)$/,
        use: [
          { loader: 'sass-loader'},
        ]
      }
    ]
  },
  devServer: {
    port: 3000
  }
});

