const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const data = require('./package.json');
const Build = require('@jupyterlab/builder').Build;

const names = Object.keys(data.dependencies).filter(function(name) {
  const packageData = require(name + '/package.json');
  return packageData.jupyterlab !== undefined;
});

const extras = Build.ensureAssets({
  packageNames: names,
  output: './build'
});

// copy static resources
const basePath = path.resolve('.');
const resources = path.resolve(basePath, './src/resources');
const target = path.resolve(basePath, './build/resources');

const buildDir = path.resolve(basePath, './build');
fs.ensureDirSync(buildDir);
fs.copySync(resources, target);

module.exports = [
  {
    entry: ['whatwg-fetch', './build/index.js'],
    output: {
      path: __dirname + '/build',
      filename: 'bundle.js'
    },
    bail: true,
    devtool: 'source-map',
    mode: 'development',
    module: {
      rules: [
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.html$/, use: 'file-loader' },
        { test: /\.md$/, use: 'raw-loader' },
        { test: /\.ipynb$/, use: 'raw-loader' },
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
          // eslint-disable-next-line no-undef
          exclude: /node_modules/
        },
        { test: /\.js.map$/, use: 'file-loader' },
        {
          // In .css files, svg is loaded as a data URI.
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          issuer: /\.css$/,
          use: {
            loader: 'svg-url-loader',
            options: { encoding: 'none', limit: 10000 }
          }
        },
        {
          // In .ts and .tsx files (both of which compile to .js), svg files
          // must be loaded as a raw string instead of data URIs.
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          issuer: /\.js$/,
          use: {
            loader: 'raw-loader'
          }
        },
        {
          test: /\.(png|jpg|gif|ttf|woff|woff2|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [{ loader: 'url-loader', options: { limit: 10000 } }]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': '{}',
        process: { cwd: () => '/' }
      })
    ],
    watchOptions: {
      poll: 500,
      aggregateTimeout: 1000,
      ignored: /node_modules/
    }
  }
].concat(extras);
