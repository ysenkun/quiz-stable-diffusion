<template>
  <!-- <h1 id="title">Welcome to Ylab</h1> -->
  <dev class="logo">
    <v-img alt="Logo" src="../assets/quiz_logo.png"></v-img>
  </dev>
  <v-btn block rounded="xl" size="large" height="72" min-width="364" class="vbt" v-on:click="start">START</v-btn>

</template>

<script>
export default {
  methods: {
    start(){
      let url_string = window.location.href;
      let url = new URL(url_string);
      let username = url.searchParams.get("username");
      this.$router.push(`/input?username=${username}`)
    }
  }
}
</script>

<style>
.logo{
  position: relative;
  top: 150px;
}

.vbt{
  /* position: absolute; */
  position: relative;
  bottom: -50%;
  margin-left: auto;
  margin-right: auto;
}
</style>