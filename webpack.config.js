const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fse = require('fs-extra');
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const PATHS = {
    src: path.join(__dirname, 'src')
}

class RunAfterCompile {
    apply(compiler) {
        compiler.hooks.done.tap('Copy Images', function() {
            fse.copySync('./src/assets/images', './dist/assets/images')
        })
        compiler.hooks.done.tap('Copy Music', function() {
            fse.copySync('./src/assets/music', './dist/assets/music')
        })
    }
}

// 1 page only: plugins [new HtmlWebpackPlugin({filename: 'index.html', template: './src/index.html'})]
const pages = fse.readdirSync('./src').filter(function(file) {
    return file.endsWith('.html')
}).map(function(page) {
    return new HtmlWebpackPlugin({filename: page, template: `./src/${page}`})
})

const config = {
    entry: {
        main: path.resolve(__dirname, 'src/scripts/main.js')
    },
    output: {
        filename: "bundled.js",
        path: path.resolve(__dirname, 'src'),
    },
    
    devtool: "inline-source-map",
    devServer: {
        static: path.join(__dirname, 'src'),
        hot: true,
        port: 3000,
        host: '0.0.0.0'
    },

    mode: "development",

    // loaders
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: ['style-loader', 'css-loader', {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "autoprefixer"
                                    ]
                                ]
                            }
                        }
                    }, 'sass-loader',
                ]
            },
            
            {
                test: /\.mp3$/,
	            loader: 'file-loader',
                options: {
                    publicPath: './dist/assets/music'
                },
            }
        ]
    },

    // plugins
    plugins: pages
}

if(currentTask == "build") {
    config.output = {
        filename: "[name].[chunkhash].js",
        chunkFilename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, 'dist'),
        clean: true
    }
    config.mode = "production"
    config.optimization = {
        splitChunks: {chunks: "all"},
        minimizer: [
            new CssMinimizerPlugin()
        ]
    }
    config.module.rules[0].use[0] = MiniCssExtractPlugin.loader
    config.module.rules.push({
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    })
    config.plugins.push(
        new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
        new WebpackManifestPlugin(),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
        }),
        new RunAfterCompile()
    )
}

module.exports = config;