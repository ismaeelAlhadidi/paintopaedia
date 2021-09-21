const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

let file = 'main';

const config = {
    entry: [ path.resolve(__dirname, '../src/js/' + file + '.js')],
    output: {
        path: path.resolve(__dirname, '../dist/' + file),
        filename:  'main.js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|pages_webpack_config)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        "@babel/plugin-syntax-dynamic-import",
                        "@babel/plugin-syntax-class-properties",
                        "@babel/plugin-proposal-class-properties",
                        "@babel/transform-runtime"
                    ]
                  }
                }
            },
            {
                test: /\.(css|sass|scss)$/,
                use: [miniCssExtractPlugin.loader, 'css-loader', 'postcss-loader',  'sass-loader'],
            },
            {
                test: /\.(jpeg|jpg|gif|png|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images',
                        publicPath: 'dist/images',
                    }
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader'
                }
            }
        ]
    },
    plugins:  [
        new CleanWebpackPlugin({
            exclude: /(images)/
        }),
        new htmlWebpackPlugin({
            hash: false,
            inject: 'body',
            template: path.join(__dirname, '../src/pages', file + '.html'),
            filename: 'index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            }
        }),/*
        new htmlWebpackPlugin({
            hash: false,
            inject: 'body',
            template: path.join(__dirname, 'src/pages', 'profile.html'),
            filename: 'profile.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            }
        }),*/
        new miniCssExtractPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                "postcss": [autoprefixer()],
            }
        }),
    ],
    optimization: {
        minimizer: [
            new UglifyjsWebpackPlugin({
                exclude: /(node_modules|bower_components|pages_webpack_config)/,
            }),
            new optimizeCssAssetsWebpackPlugin(),
        ],
    },
    devServer: {
        port: 8080,
        open: false,
        writeToDisk: true,
    },
};

module.exports = config;