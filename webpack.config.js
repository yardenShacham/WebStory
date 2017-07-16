const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, './public');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});
const HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
    entry: './src/index.ts',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: './'
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './public'),
        compress: true,
        port: 8080,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        extractSass,
        new HtmlWebpackPlugin({
            title: 'Web Story',
            filename: 'index.html',
            template: 'public/index.html',
            inject: 'body'
        })
    ]
};

module.exports = config;