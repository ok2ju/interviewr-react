const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const sassLoaders = [
  'css-loader?sourceMap',
  'postcss-loader',
  'sass-loader?outputStyle=expanded',
];

module.exports = {
  context: path.join(__dirname, './src'),
  entry: {
    jsx: './index.js',
    vendor: [
      'react',
      'react-dom',
    ],
  },
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
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot',
          'babel-loader',
        ],
      },
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf)$/,
        loader: 'url-loader?limit=8192',
      },
    ],
  },
  // Resolve the `./src` directory so we can avoid writing
  // ../../styles/base.css
  resolve: {
    modulesDirectories: ['node_modules', './src'],
    extensions: ['', '.js', '.jsx'],
  },
  postcss: function () {
    return [autoprefixer({
      browsers: ['last 2 versions'],
    })];
  },
  eslint: {
    configFile: './.eslintrc',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new ExtractTextPlugin('style.css', { allChunks: true }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};
