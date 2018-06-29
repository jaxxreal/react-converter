'use strict';
/*jshint esversion: 6 */
/*jshint node: true */

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const baseConfig = require('./webpack.config.base');

module.exports = webpackMerge.smart(baseConfig, {
    mode: 'production',
    devtool: 'source-map',
    output: {
        publicPath: '/exchanger/'
    },
    chunkFilename: '[id].[hash].chunk.ts',
    module: {
        preLoaders: [],
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: { onlyCompileBundledFiles: true }
            },
            {
                test: /\.(less|css)$/,
                loader: ExtractTextPlugin.extract('css!postcss!less?sourceMap'),
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css', { allChunks: true }),
        new webpack.DefinePlugin({
            '__DEV__': JSON.stringify(false),
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false
            }
        }),
        new HtmlWebpackPlugin({
            template: 'src/template.html'
        })
    ]
});
