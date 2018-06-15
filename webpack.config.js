const OpenBrowserPlugin = require("open-browser-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: [
    "webpack/hot/only-dev-server",
    `${path.resolve(__dirname, "src")}/index.jsx`,
  ],
  module: {
    loaders: [
      {
        loaders: ["style-loader", "css-loader"],
        test: /\.css$/,
      },
      {
        exclude: /(node_modules)/,
        include: path.join(__dirname, "src"),
        loader: "babel-loader",
        query: {
          presets: ["react"],
        },
        test: /\.jsx?$/,
      },
    ],
  },
  devtool: "cheap-module-eval-source-map",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist",
  },
  plugins: [new OpenBrowserPlugin({ url: "http://localhost:8080" })],
  resolve: {
    extensions: [".webpack.js", ".js", ".jsx"],
  },
};
