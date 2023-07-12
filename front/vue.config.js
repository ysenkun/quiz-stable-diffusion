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
    // proxy: {
    //   '/ws': {
    //     target: "https://yulon.cps.akita-pu.ac.jp:8080",
    //     changeOrigin: true,
    //     ws: false,
    //   }
    // }
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
// module.exports = defineConfig({
//   devServer: {
//     https: true,
//   },})
