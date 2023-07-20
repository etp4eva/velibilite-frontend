const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    mode: 'development',
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        },
        {
            test:/\.css$/,
            use:['style-loader','css-loader']
        },
        {
            test: /\.(png|jpg|gif)/,
            type: 'asset/resource'
        },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: './src/index.html'
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'images/[name][ext]',
    },
    devServer: {
        static: {
        directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000
    },
};