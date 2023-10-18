const path = require('path') // lấy đường dẫn tuyệt đối của thư mục
const UglifyJsWebpackPlugin  = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const config = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: 'http://localhost/goclamme/api/public/'
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
    optimization: {
        minimizer: [
        new UglifyJsWebpackPlugin({
            uglifyOptions: {
            compress: {
                warnings: false,
                comparisons: false,
            },
            output: {
                comments: false,
                ascii_only: true,
            },
            },
            sourceMap: true,
        }),
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify("production"),
            'process.env.BASE_URL': JSON.stringify("http://localhost/goclamme/api/public"),
            'process.env.BASE_PATH': JSON.stringify("goclamme/api/public"),
            'process.env.PREFIX_PATH': JSON.stringify(""),
        })
    ]
}

module.exports = config;