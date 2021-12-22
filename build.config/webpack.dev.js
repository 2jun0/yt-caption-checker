const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')
const ExtensionReloader = require('webpack-extension-reloader')

module.exports = (env, argv) => {
  return merge(commonConfig(env, argv), {
    mode: 'development',
    devtool: 'inline-source-map',
    watch: true,
    watchOptions: {
      ignored: [/node_modules/, /dist/],
    },
    plugins: [new ExtensionReloader()],
  })
}
