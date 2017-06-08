[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![test][test]][test-url]
[![coverage][cover]][cover-url]
[![quality][quality]][quality-url]
[![chat][chat]][chat-url]

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" vspace="" hspace="25"
      src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon.svg">
  </a>
  <h1>PurifyCSS Plugin</h1>
  <p>PurifyCSS for Webpack.<p>
</div>

This plugin uses [PurifyCSS](https://github.com/purifycss/purifycss) to remove unused selectors from your CSS. You **should** use it with the [extract-text-webpack-plugin](https://www.npmjs.com/package/extract-text-webpack-plugin).

Without any CSS file being emitted as an asset, this plugin will do nothing. You can also use the `file` plugin to drop a CSS file into your output folder, but it is highly recommended to use the PurifyCSS plugin with the Extract Text plugin.

> This plugin replaces earlier [purifycss-webpack-plugin](https://www.npmjs.com/package/purifycss-webpack-plugin) and it has a different API!

<h2 align="center">Install</h2>

```bash
npm i -D purifycss-webpack purify-css
```

<h2 align="center">Usage</h2>

Configure as follows:

```javascript
const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

module.exports = {
  entry: {...},
  output: {...},
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].[contenthash].css'),
    // Make sure this is after ExtractTextPlugin!
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'app/*.html')),
    })
  ]
};
```

And, that's it! Your scripts and view files will be scanned for classes, and those that are unused will be stripped off your CSS - aka. "purified".

In order to use this plugin to look into multiple paths you will need to:

1. npm install --save glob-all
2. Add `const glob = require('glob-all');` at the top of your webpack config
3. Then you can pass your paths to an array, like so:

```javascript
paths: glob.sync([
  path.join(__dirname, '.php'),
  path.join(__dirname, 'partials/.php')
]),
```

> You can pass an object (`<entry> -> [<absolute path>]`) to `paths` if you want to control the behavior per entry.

<h2 align="center">Options</h2>

This plugin, unlike the original PurifyCSS plugin, provides special features, such as scanning the dependency files. You can configure using the following fields:

| Property            | Description
|---------------------|------------
| `moduleExtensions`  | An array of file extensions for determining used classes within `node_modules`. Defaults to `[]`, but `['.html']` can be useful here.
| `minimize`          | Enable CSS minification. Alias to `purifyOptions.minify`. Disabled by default.
| `paths`             | An array of absolute paths or a path to traverse. This also accepts an object (`<entry name> -> <paths>`). It can be a good idea [glob](http://npmjs.org/glob) these.
| `purifyOptions`     | Pass [custom options to PurifyCSS](https://github.com/purifycss/purifycss#the-optional-options-argument).
| `verbose`           | Set this flag to get verbose output from the plugin. This sets `purifyOptions.info`, but you can override `info` separately if you want less logging.

> The plugin does **not** emit sourcemaps even if you enable `sourceMap` option on loaders!

<h2 align="center">Usage with CSS Modules</h2>

PurifyCSS doesn't support classes that have been namespaced with CSS Modules. However, by adding a static string to `css-loader`'s `localIdentName`, you can effectively whitelist these namespaced classes.

In this example, `purify` will be our whitelisted string. **Note:** Make sure this string doesn't occur in any of your other CSS class names. Keep in mind that whatever you choose will end up in your application at runtime - try to keep it short!

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                localIdentName: 'purify_[hash:base64:5]',
                modules: true
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    ...,
    new PurifyCSSPlugin({
      purifyOptions: {
        whitelist: ['*purify*']
      }
    })
  ]
};
```

<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/166921?v=3&s=150">
        </br>
        <a href="https://github.com/bebraw">Juho Vepsäläinen</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars2.githubusercontent.com/u/8420490?v=3&s=150">
        </br>
        <a href="https://github.com/d3viant0ne">Joshua Wiens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/533616?v=3&s=150">
        </br>
        <a href="https://github.com/SpaceK33z">Kees Kluskens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/3408176?v=3&s=150">
        </br>
        <a href="https://github.com/TheLarkInn">Sean Larkin</a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/purifycss-webpack.svg
[npm-url]: https://npmjs.com/package/purifycss-webpack

[deps]: https://david-dm.org/webpack-contrib/purifycss-webpack.svg
[deps-url]: https://david-dm.org/webpack-contrib/purifycss-webpack

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: https://secure.travis-ci.org/webpack-contrib/purifycss-webpack.svg
[test-url]: http://travis-ci.org/webpack-contrib/purifycss-webpack

[cover]: https://codecov.io/gh/webpack-contrib/purifycss-webpack/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/purifycss-webpack

[quality]: https://www.bithound.io/github/webpack-contrib/purifycss-webpack/badges/score.svg
[quality-url]: https://www.bithound.io/github/webpack-contrib/purifycss-webpack
