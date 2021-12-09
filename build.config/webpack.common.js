const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const {
  YoutudeDlDownloaderWebpackPlugin,
} = require('youtube-dl-downloader-wepback-plugin');

module.exports = (env, argv) => {
  return {
    entry: {
      content_script: resolve(__dirname, '../src/js/content_script/index.js'),
      popup: resolve(__dirname, '../src/js/popup/index.js'),
    },
    output: {
      filename: 'js/[name].js',
      path:
        argv.browser === 'chrome'
          ? resolve(__dirname, '../dist/chrome')
          : resolve(__dirname, '../dist/firefox'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },

        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024 * 10,
                outputPath: 'asset',
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    node: {
      fs: 'empty',
      child_process: 'empty',
    },
    resolve: {
      modules: ['./src', './node_modules'],
      extensions: ['.js', '.json'],
    },
    plugins: [
      new FriendlyErrors(),
      new CleanWebpackPlugin(),
      new YoutudeDlDownloaderWebpackPlugin({
        to: 'lib',
        from: 'auto',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from:
              argv.browser === 'chrome'
                ? resolve(__dirname, '../manifest/chrome.json')
                : resolve(__dirname, '../manifest/firefox.json'),
            to: 'manifest.json',
          },
          {
            from: resolve(__dirname, '../src/_locales'),
            to: '_locales',
          },
          {
            from: resolve(__dirname, '../src/asset'),
            to: 'asset',
          },
          {
            from: resolve(__dirname, '../src/css'),
            to: 'css',
          },
          {
            from: resolve(__dirname, '../src/html'),
            to: 'html',
          },
          {
            from: resolve(__dirname, '../src/lib'),
            to: 'lib',
          },
        ],
      }),
    ],
  };
};
