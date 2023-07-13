const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pages: {
    index: {
      entry: "src/main.js",
      title: "quiz"
    }
  },
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

