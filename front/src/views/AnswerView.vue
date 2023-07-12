<template>
  <h1>答え</h1>
    <v-img alt="quiz" src="../../public/quiz_image/21_output.jpeg" id='ans-img'></v-img>
  <v-btn color="blue" v-on:click="HomeClick()" id="back-btn">ホーム戻る</v-btn>
</template>

<script>
export default {
  methods: {
    HomeClick(){
      this.$router.push(`/`)
    }
  }
}
</script>

<style>
</style>