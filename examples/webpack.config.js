const path = require('path');
const merge = require('webpack-merge');
const glob = require('glob');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  another: path.join(__dirname, 'another'),
  build: path.join(__dirname, 'build')
};

module.exports = [
  merge(
    {
      entry: {
        app: PATHS.app
      },
      output: {
        path: path.join(PATHS.build, 'first'),
        filename: '[name].js'
      }
    },
    parts.extractCSS(),
    parts.purifyCSS({
      verbose: true,
      minimize: true,
      paths: glob.sync(`${PATHS.app}/*`)
    })
  ),
  merge(
    {
      entry: {
        first: PATHS.app,
        second: PATHS.another
      },
      output: {
        path: path.join(PATHS.build, 'second'),
        filename: '[name].js'
      }
    },
    parts.extractCSS(),
    parts.purifyCSS({
      paths: {
        first: glob.sync(`${PATHS.app}/*`),
        second: glob.sync(`${PATHS.another}/*`)
      }
    })
  )
];
