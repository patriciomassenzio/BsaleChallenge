/** https://webpack.js.org/concepts/ */
/* https://www.npmjs.com/package/html-webpack-plugin */
/* https://getbootstrap.com/docs/4.3/getting-started/webpack/ */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlWebpack = new HtmlWebpackPlugin({
  template: './assets/index.template.html',
  filename: 'index.html',
  minify: false,
});

module.exports = {
  entry: './assets/javascript/entry.js',
  output: {
      publicPath: '/',
      path: path.join(__dirname, '..'),
      filename: 'dist/javascript/bundle.js'
  },
  plugins: [htmlWebpack],
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [{
          loader: 'style-loader', 
        }, {
          loader: 'css-loader', 
        },
        {
          loader: 'postcss-loader', 
          options: {
            postcssOptions: {
              plugins: function () { 
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          }
        }]
      }
    ]
  }
}