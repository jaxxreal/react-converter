const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');
const SVGSpritePlugin = require('svg-sprite-loader/plugin');

const dependencies = Object.keys(packageJson.dependencies).filter(v => v !== 'normalize.css');
const BASE_DIR = __dirname;
const ENV = process.env.NODE_ENV;

module.exports = {
    entry: {
        app: path.join(BASE_DIR, 'src', 'app', 'client.tsx'),
        vendor: dependencies
    },
    resolve: {
        alias: {
            basedir: path.resolve(BASE_DIR)
        },
        extensions: ['.js', '.ts', '.tsx', '.css', '.less']
    },
    output: {
        path: path.resolve(BASE_DIR, './dist'),
        publicPath: '/',
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    module: {
        // noParse: dependencies, // TODO if smth goes wrong, check this
        rules: [
            // { test: /\.(html|txt)/, use: 'raw' },
            // { test: /\.json$/, use: 'json' },
            // { test: /\.(woff|woff2|eot|ttf)$/, use: 'url-loader?limit=100000', exclude: /https/ },
            {
                test: /\.(png|jpg|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/[name].[ext]',
                            exclude: /https/
                        },
                    },
                ]
            },
            {
                test: /\.svg$/,
                use: [{
                    loader: 'svg-sprite-loader',
                    options: {
                        options: { extract: true }
                        // name: '[name]_[hash]',
                        // prefixize: true
                    }
                }]
            }
        ]
    },

    // optimization: {
    //     splitChunks: {
    //         chunkGroups: {
    //             vendor: {
    //                 chunks: 'initial',
    //                 test: path.resolve(__dirname, 'node_modules'),
    //                 name: 'vendor',
    //                 enforce: true,
    //             },
    //         },
    //     },
    // },

    plugins: [
        new webpack.DefinePlugin({
            ENV: JSON.stringify(ENV),
        }),
        new SVGSpritePlugin(),

        // new webpack.optimize.CommonsChunkPlugin({
        //     names: ['app', 'vendor'],
        //     minChunks: Infinity
        // })
    ]
};
