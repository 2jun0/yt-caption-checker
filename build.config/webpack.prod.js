const fs = require('fs');
const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const version = require('../package.json').version;

module.exports = (env, argv) => {
  try {
    let manifest = fs.readFileSync(
      path.resolve(__dirname, `../manifest/${argv.browser}.json`),
      'utf-8',
    );
    manifest = JSON.parse(manifest);

    console.log(manifest.version, '==>', version);

    manifest.version = version;
    fs.writeFileSync(
      path.resolve(__dirname, `../manifest/${argv.browser}.json`),
      JSON.stringify(manifest, ' ', 2),
      'utf-8',
    );

    return merge(commonConfig(env, argv), {
      mode: 'production',
    });
  } catch (err) {
    console.error(err);
  }
};
