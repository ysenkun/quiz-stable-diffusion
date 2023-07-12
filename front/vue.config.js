const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    https: true,
  },
  //transpileDependencies: true,
  devServer: {
    client: {
      webSocketURL: 'auto://yulon.cps.akita-pu.ac.jp/ws',
    },
  },
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})

