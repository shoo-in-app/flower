const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
});

module.exports = {
  mode: "development",
  entry: "./src/index.jsx",
  module: {
    rules: [
      {
        test: /\.js(x)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["env", "react"] },
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: { localIdentName: "[name]_[local]_[hash:base64]" },
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: { plugins: [require("cssnano")()] },
          },
        ],
      },
      {
        test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: "file-loader?name=[name].[ext]",
      },
    ],
  },
  resolve: { extensions: [".js", ".jsx"] },
  plugins: [htmlWebpackPlugin],
  devtool: "source-map",
  devServer: { contentBase: __dirname + "/dist" },
};
