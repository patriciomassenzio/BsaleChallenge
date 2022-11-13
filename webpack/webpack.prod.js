const common = require('./webpack.common.js');
const {merge} = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin").default;

const loader = require('sass-loader');

module.exports = merge(common, {
  mode: 'production',
  stats:{
    children: true,
  },
  output:{
    publicPath: '.'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'dist/css/[name].[contenthash].css',
      //chunkFilename: "[id].css"
    })
  ],
  module:{
    rules:[
      {
        test: /\.(scss)$/,
        use: [{loader: MiniCssExtractPlugin.loader}, 'css-loader', 'sass-loader']
      }
    ]
  }  
});

