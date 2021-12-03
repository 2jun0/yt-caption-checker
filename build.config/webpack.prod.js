const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = (env, argv) => {
  return merge(commonConfig(env, argv), {
    mode: 'production',
  });
};
