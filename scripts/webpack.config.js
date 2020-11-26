﻿"use strict";

const path = require("path"),
  extend = require("extend"),
  webpack = require("webpack"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  UglifyJsPlugin = require("uglifyjs-webpack-plugin");

/**
 * Gets webpack configuration based on specified build mode.
 */
const getConfig = function (mode, folder) {
  let config = {
    target: "node-webkit",

    output: {
      filename: folder + "/[name].js",
      publicPath: folder + "/",
    },

    resolve: {
      alias: {
        core: path.resolve("src/core"),
        photoshop: path.resolve("src/photoshop"),
        ractive: "ractive/runtime.js",
      },
    },

    module: {
      rules: [
        { test: /\.js$/, use: "babel-loader", exclude: /(node_modules)/ },
        {
          test: /\.html$/,
          use: path.resolve(__dirname, "webpack.loader.ractive.js"),
        },
        {
          test: /\.jsx$/,
          use: path.resolve(__dirname, "webpack.loader.jsx.js"),
        },
        { test: /\.fx$/, use: "raw-loader" },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: "css-loader", options: { importLoaders: 1 } },
            "postcss-loader",
            "less-loader",
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: "url-loader",
        },
      ],
    },

    plugins: [
      // NOTE: order matters! Plugin definitions might be overridden later on during the build process
      new webpack.DefinePlugin({}),
      new MiniCssExtractPlugin({ filename: folder + "/[name].css" }),
      new webpack.ProvidePlugin({ Promise: "bluebird" }),
    ],
  };

  // Mode-based configuration
  if (mode === "debug") {
    // Debug
    extend(config, {
      mode: "development",
      watch: true,
      devtool: "eval-source-map",
    });

    config.plugins[0].definitions.RELEASE = false;
    config.plugins.push(new webpack.LoaderOptionsPlugin({ debug: true })); // REVIEW: useful?
  } else {
    // Release
    config.plugins[0].definitions.RELEASE = true;

    extend(config, {
      mode: "production",
      optimization: {
        minimizer: [
          new UglifyJsPlugin({
            parallel: true,
          }),
        ],
      },
    });
  }

  return config;
};

module.exports = {
  getConfig,
};
