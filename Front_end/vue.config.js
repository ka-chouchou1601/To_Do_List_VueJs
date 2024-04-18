const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
   
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', 
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // Remove the '/api' prefix
        }
      }
    }
  }

});

module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete("eslint");
  },
};