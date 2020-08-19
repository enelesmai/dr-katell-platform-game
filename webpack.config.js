/* eslint-disable comma-dangle */

const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
  ],
  module: {
    rules: [{
      test: /\.(png|jpg|gif)$/,
      use: {
        loader: 'file-loader',
        options: {
          outputPath: 'assets'
        }
      }
    },
    {
      test: /\.(mp3|wav|wma|ogg|aif)$/,
      loader: 'file-loader',
    },
    {
      test: /\.html$/i,
      loader: 'html-loader',
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    }, { test: /\.jsx?$/, exclude: /'node_modules'/, loader: 'babel-loader' },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  }
};