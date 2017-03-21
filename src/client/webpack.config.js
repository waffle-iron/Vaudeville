var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  context: __dirname,
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './app/app.tsx'
      ],
    vendor: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      use: ['source-map-loader'],
    }, {
      test: /\.tsx?$/,
      use: ['react-hot-loader/webpack', 'awesome-typescript-loader'],
      exclude: [/node_modules/]
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader?soureMap&modules&camelCase=dashes&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
      }),
    }]
  },
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    proxy: {
      "/api/**": {
        target: "http://localhost:3000"
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      inject: 'body'
    }),
    new ExtractTextPlugin('[name].bundle.css'),
    new WebpackCleanupPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({names: ['vendor', 'manifest']}),
  ]
}