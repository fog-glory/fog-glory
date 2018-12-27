const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCSSPlugin = require('../');

exports.extractCSS = function extractCSS(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include: paths,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader?sourceMap'
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css?[hash]'
      })
    ]
  };
};

exports.purifyCSS = function purifyCSS(options) {
  return {
    plugins: [
      new PurifyCSSPlugin(options)
    ]
  };
};
