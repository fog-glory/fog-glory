import fs from 'fs';
import purify from 'purify-css';
import { ConcatSource } from 'webpack-sources';
import * as parse from './parse';
import * as search from './search';
import validateOptions from './validate-options';
import schema from './schema';

module.exports = function PurifyPlugin(options) {
  return {
    apply(compiler) {
      const validation = validateOptions(
        schema({
          entry: compiler.options.entry
        }),
        options
      );

      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      compiler.plugin('this-compilation', (compilation) => {
        const entryPaths = parse.entryPaths(options.paths);

        parse.flatten(entryPaths).forEach((p) => {
          if (!fs.existsSync(p)) throw new Error(`Path ${p} does not exist.`);
        });

        // Output debug information through a callback pattern
        // to avoid unnecessary processing
        const output = options.verbose ?
          messageCb => console.info(...messageCb()) :
          () => {};

        compilation.plugin('additional-assets', (cb) => {
          // Go through chunks and purify as configured
          compilation.chunks.forEach(
            (chunk) => {
              const { name: chunkName, files } = chunk;
              const modules = chunk.mapModules(module => module);
              const assetsToPurify = search.assets(
                compilation.assets, options.styleExtensions
              ).filter(
                asset => files.indexOf(asset.name) >= 0
              );

              output(() => [
                'Assets to purify:',
                assetsToPurify.map(({ name }) => name).join(', ')
              ]);

              assetsToPurify.forEach(({ name, asset }) => {
                const filesToSearch = parse.entries(entryPaths, chunkName).concat(
                  search.files(
                    modules, options.moduleExtensions || [], file => file.resource
                  )
                );

                output(() => [
                  'Files to search for used rules:',
                  filesToSearch.join(', ')
                ]);

                // Compile through Purify and attach to output.
                // This loses sourcemaps should there be any!
                compilation.assets[name] = new ConcatSource(
                  purify(
                    filesToSearch,
                    asset.source(),
                    {
                      info: options.verbose,
                      minify: options.minimize,
                      ...options.purifyOptions
                    }
                  )
                );
              });
            }
          );

          cb();
        });
      });
    }
  };
};
