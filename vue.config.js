module.exports = {
  /** 区分打包环境与开发环境
   * process.env.NODE_ENV==='production'  (打包环境)
   * process.env.NODE_ENV==='development' (开发环境)
   * baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',
   */
  devServer: {
      open: process.platform === 'darwin',
      host: 'localhost',
      port: 8081,
      https: false,
      hotOnly: false,
      proxy: {
        '/api': {
          // target: 'https://121.43.54.126:443',
          target: 'http://localhost:47581',
          changeOrigin: true,
          ws:true,
          pathRewrite: {
            '^/api': '/'
          }
        },
        // 下载接口前缀，解决跨域问题
        '/fzideo': {
          // target: 'https://121.43.54.126:443',
          target: 'http://127.0.0.1',
          changeOrigin: true,
          ws:true,
          pathRewrite: {
            '^/fzideo': '/'
          }
        }
      }, // 设置代理
      before: app => {}
  },
  // 第三方插件配置
  //
  // proxy: {
  //     '/administrator': {
  //         target: `http://localhost:8080/`, //后台服务地址
  //         changeOrigin: true,
  //         pathRewrite: {
  //         }
  //     }
  // }
}