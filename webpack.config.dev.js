'use strict';
/*jshint esversion: 6 */
/*jshint node: true */

const fs = require('fs');
const url = require('url');
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const StyleLintPlugin = require('stylelint-webpack-plugin');

const noop = require('lodash/noop');

const baseConfig = require('./webpack.config.base');
const HOST = '127.0.0.1';
const PORT = 8080;
const HOST_URI = `http://${HOST}:${PORT}`;

module.exports = webpackMerge.smart(baseConfig, {
    // mode: 'development',
    // devtool: 'cheap-module-eval-source-map',
    entry: {
        app: [
            // 'webpack/hot/only-dev-server',
            // `webpack-dev-server/client?${HOST_URI}`,
            baseConfig.entry.app
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    onlyCompileBundledFiles: true,
                    logLevel: 'error',
                }
            },
            {
                test: /\.(less|css)$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'less-loader',
                    },
                ]
            }
        ]
    },
    resolve: {
        alias: { mobx: path.resolve(__dirname, 'node_modules/mobx') },
    },
    devServer: {
        // hot: true,
        // historyApiFallback: true,
        // stats: 'minimal',
        // host: '0.0.0.0'
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin({
        //     multiStep: true
        // }),
        // new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(true),
        }),
        new HtmlWebpackPlugin({
            template: 'src/template.html'
        }),
    ]
});
