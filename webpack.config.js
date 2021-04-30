const path = require("path")

module.exports = {
  mode: 'production',
  entry: "./src/index.js",
  performance: {
    hints: process.env.NODE_ENV === 'production' ? "warning" : false
  },
  output: {
    path: path.resolve(__dirname, "dist/js"),
    publicPath: '/dist/',
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["babel-preset-env"]
          }
        }
      }
    ]
  }
}