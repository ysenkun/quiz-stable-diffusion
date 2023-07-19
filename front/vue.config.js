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
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})

