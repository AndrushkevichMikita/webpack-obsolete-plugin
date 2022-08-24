/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
const browserslist = require('browserslist');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { readFileSync } = require('fs');

/** @type {import('webpack').library.AbstractLibraryPlugin} */
class ObsoleteWebpackPlugin {
  constructor(options) {
    const defaultOptions = {
      name: 'obsolete'
    };

    this.options = {
      ...defaultOptions,
      ...options
    };
  }

  /**
   * Code indentation.
   *
   * @param {string} str
   * @param {number} size
   */
  indent(str, size) {
    return ' '.repeat(size) + str.replace(/\n/g, `$&${' '.repeat(size)}`);
  }

  stringify(json, indent = 2) {
    return JSON.stringify(json, null, indent)
      .replace(/"/g, `'`)
      .replace(/'(\w+)':/g, '$1:');
  }

  filterObject(object, callback, thisArg) {
    const ret = {};

    Object.entries(object).forEach(([key, value]) => {
      if (callback.call(thisArg, value, key, object)) {
        ret[key] = value;
      }
    });
    return ret;
  }

  /** @type {import('webpack').library.AbstractLibraryPlugin['apply']} */
  apply(compiler) {
    compiler.hooks.compilation.tap(this.constructor.name, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: this.constructor.name,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS
        },
        () => {
          const chunk = compilation.addChunk('obsolete');
          chunk.id = 'obsolete';
          chunk.ids = ['obsolete'];
          // eslint-disable-next-line no-restricted-syntax
          for (const entrypoint of compilation.entrypoints.values()) {
            if (entrypoint.pushChunk(chunk)) {
              chunk.addGroup(entrypoint);
            }
          }
          const tmpFile = 'obsolete.js';
          chunk.files.add(tmpFile);
          const { RawSource } = compiler.webpack.sources;
          const obsoleteFileContent = this.composeCode(this.options);

          compilation.assets[tmpFile] = new RawSource(obsoleteFileContent);
          compilation.updateAsset(tmpFile, (v) => v);
        }
      );
    });
  }

  composeCode(context) {
    const options = {
      template: context.template
    };
    const slimOptions = this.filterObject(
      options,
      (value) => !['', null, undefined].includes(value)
    );
    // todo mb error in path
    const fileContent = readFileSync('../build/obsolete.js', {
      encoding: 'utf-8'
    });
    return (
      fileContent +
      [
        this.indent(`(function() {`, 0),
        this.indent(`'use strict';`, 2),
        this.indent(
          `obsolete(${this.stringify(browserslist())},${this.stringify(
            slimOptions
          )});`,
          2
        ),
        this.indent(`})();\n`, 0)
      ].join('\n')
    );
  }
}
module.exports = ObsoleteWebpackPlugin;
