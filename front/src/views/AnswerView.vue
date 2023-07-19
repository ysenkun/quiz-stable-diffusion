<template>
  <h1>Answer</h1>
    <v-img alt="quiz" :src="answer_img.src" id='ans-img'></v-img>
  <v-btn color="blue" v-on:click="HomeClick()" id="back-btn">Home</v-btn>
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
      let url_string = window.location.href;
      let url = new URL(url_string);
      let username = url.searchParams.get("username");
      this.$router.push(`/?username=${username}`)
    }
  }
}
</script>

<style>
</style>