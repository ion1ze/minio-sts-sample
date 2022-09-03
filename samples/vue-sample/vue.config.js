const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath:'./',
  devServer:{
    port: 3000,
    proxy:{
      '/api':{
        target:'http://localhost:5000/api',
        ws:false,
        changeOrigin:true,
        pathRewrite:{
          '^/api':''
        }
      }
    }
  },
  transpileDependencies: true
})
