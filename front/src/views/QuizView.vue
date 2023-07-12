<template>
  <div class="about">
    <h1>AIが書いた絵を当てろ!</h1>
    <v-img alt="quiz" :src="image.src"></v-img>
  </div>
  <v-btn color="blue" v-on:click="$router.back()">戻る</v-btn>
</template>

<script>
export default {
  data() {
    return{
      image: {},
    }
  },
  async mounted() {
    const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );
    for (var i = 6;  i < 21;  i++) {
      this.image= {src: require(`../../public/quiz_image/${i}_output.jpeg`)}
      await sleep( 3000 );
    }
  }
}
</script>
