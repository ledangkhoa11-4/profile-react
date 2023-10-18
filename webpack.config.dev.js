const path = require('path') // lấy đường dẫn tuyệt đối của thư mục
const HtmlWebPackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');
const config = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    watchContentBase: true,
    publicPath: '/'
  },
  resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.js', '.json', '.jsx', '.css'],
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        exclude: /node_modules/,
        test: /\.js$/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jp(e*)g|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'profile/images'
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'profile/fonts'
            },
          },
        ],
      }
    ]
  },
  plugins: [
       new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify("development"),
        'process.env.BASE_URL': JSON.stringify("http://localhost:8000"),
        'process.env.BASE_PATH': JSON.stringify(""),
        'process.env.PREFIX_PATH': JSON.stringify(""),
       }),
       new HtmlWebPackPlugin({
          template: path.resolve( __dirname, 'public/index.html'),
          filename: 'index.html'
      })
  ]
}

module.exports = config;