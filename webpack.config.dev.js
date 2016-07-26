const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.config');

const sassLoaders = [
  'css-loader?sourceMap',
  'postcss-loader',
  'sass-loader?outputStyle=expanded',
];

module.exports = merge(common, {
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:3000/',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
    loaders: [
      // https://github.com/webpack/webpack/issues/2248
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!')),
      },
      {
        test: /\.css$/,
        include: /src/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
      },
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf)$/,
        loader: 'url-loader?limit=8192',
      },
    ],
  },
  eslint: {
    configFile: './.eslintrc',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
});
