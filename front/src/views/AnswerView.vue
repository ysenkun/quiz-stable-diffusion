<template>
  <h1>答え</h1>
    <v-img alt="quiz" :src="answer_img.src" id='ans-img'></v-img>
  <v-btn color="blue" v-on:click="HomeClick()" id="back-btn">ホーム戻る</v-btn>
</template>

<script>
export default {
  data() {
    return{
      answer_img: {},
    }
  },
  mounted() {
    try {
      this.answer_img = {src: require('../assets/quiz_image/19_output.jpeg')};
    }
    catch (e) {
      console.log(e)
    }
  },
  methods: {
    HomeClick(){
      this.$router.push(`/`)
    }
  }
}
</script>

<style>
</style>