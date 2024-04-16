const path = require("path")

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].min.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
      },
    ],
  },
  mode: "development",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"),
    },
  },
}
