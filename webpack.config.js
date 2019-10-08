var path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
var config = null;

module.exports = {
  entry: "./app/main.js",
  mode: 'development',
  output: {
    path: path.resolve(__dirname, getWebroot() + "deploy"),
    filename: "bundle.js",
    publicPath: "/deploy"
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    //   'vue': 'vue/dist/vue.js'
    }
  },  
  module: {
    rules: [
        {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",                   
                    options: { 
                        presets: ["es2015", "es2015-ie"] 
                    }
                }
        },
        {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader",
                    options : {
                        sourceMap: true
                    }
                },
                {
                    loader: "sass-loader",
                    options : {
                        sourceMap: true
                    }
                }
            ]
        },
        {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        { 
          test: /\.(eot|svg|ttf|woff|woff2)$/, 
          loader: 'file?name=[name].[ext]'
        }
    ]
  },
  
  plugins: [
    new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),

      new CopyWebpackPlugin([
        // { from: getWebroot() + "dist/main.css", to: 'dist/' },
        { from: getWebroot() + "deploy/bundle.js", to: 'deploy/' }
      ], {})      
  ]  
};

function getWebroot() {
    if (!config) {
        var file = "";
        try {
            var env = process.env.NODE_ENV || '';
            if (env != '') {
                env = '.' + env;
            }
            file = './webpack.dest' + env + '.js';
            config = require(file);
        } catch (ex) {
            console.log('Could not load "' + file + '".');
        }
    }

    
    return config ? config.webroot : './deploy/';
}