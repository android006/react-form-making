var path = require('path')
var webpack = require('webpack')
module.exports = {
  entry: './src/index.js', //入口文件路径
  output: {
    filename: 'main.js',
    library: 'react-form-making',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,  // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader' // 加载模块 "babel-loader"
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {loader: 'css-loader', options: {importLoaders: 1}},
          'less-loader',
          {loader: 'less-loader', options: {javascriptEnabled: true}}
        ]
      },
      {
        test: /\.css$/,
        use: [{
          loader: "style-loader"
        },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]-[local]',
              },
            }
          }
        ]
      },
      { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'},
      { test: /\.png$/, loader: "file-loader?name=images/[hash:8].[name].[ext]" }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  performance: {
    hints: 'error',
    maxAssetSize: 30000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 50000000 // 整数类型（以字节为单位）
  }
}