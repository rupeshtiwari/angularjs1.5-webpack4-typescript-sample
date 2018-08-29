const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const appDir = 'example-app/'
const moduleDir = 'module-app/'
const ENV = process.env.NODE_ENV || 'development'

const webpackConfigEntryPoints = {
  app: './index.ts'
}

const webpackConfigLoaders = [
  // Scripts
  {
    test: /\.ts$/,
    exclude: [/node_modules/],
    loader: 'ts-loader',
    include: [
      path.resolve(__dirname, moduleDir),
      path.resolve(__dirname, appDir)
    ]
  },
  // Styles
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader',
    include: [
      path.join(__dirname, appDir),
      path.join(__dirname, 'node_modules/bootstrap')
    ]
  },

  // less
  {
    test: /\.less$/,
    use: [
      {
        loader: 'style-loader' // creates style nodes from JS strings
      },
      {
        loader: 'css-loader', // translates CSS into CommonJS
        options: { url: true }
      },
      {
        loader: 'less-loader' // compiles Less to CSS
      }
    ],
    include: [path.resolve(__dirname, 'assets')]
  },

  // images/fonts
  {
    test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
    use: 'base64-inline-loader'
  },

  // HTML
  {
    test: /\.html$/,
    loader: 'raw-loader',
    include: [
      path.resolve(__dirname, moduleDir),
      path.resolve(__dirname, appDir)
    ]
  }
]

const webpackConfigPlugins = [
  new HtmlWebpackPlugin({
    template: 'index.html',
    inject: 'body',
    hash: true,
    env: ENV,
    host: '0.0.0.0',
    port: process.env.npm_package_config_port
  }),
  new CopyWebpackPlugin([
    {
      from: path.join(__dirname, 'phones/'),
      to: 'phones/',
      force: true
    }
  ])
]

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  context: path.resolve(appDir),
  entry: webpackConfigEntryPoints,
  resolve: {
    plugins: [
      // new TsconfigPathsPlugin({
      //   configFile: path.join(__dirname, appDir + 'tsconfig.app.json')
      // })
    ],
    // Add `.ts` as a resolvable extension.
    extensions: ['.tsx', '.ts', '.js', '.html']
  },
  watch: true,
  module: {
    rules: webpackConfigLoaders
  },
  plugins: webpackConfigPlugins,
  devServer: {
    publicPath: '/',
    contentBase: path.resolve(__dirname, appDir),
    historyApiFallback: {
      index: '/'
    },
    port: 3000,
    inline: true,
    https: false,
    quiet: false,
    compress: true
  }
}
