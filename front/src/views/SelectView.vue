<template>
  <v-btn block rounded="xl" size="large" height="72" min-width="364" class="q-vbt" v-on:click="start('questioner')">出題者</v-btn>
  <v-btn block rounded="xl" size="large" height="72" min-width="364" class="a-vbt" v-on:click="start('respondent')">回答者</v-btn>
  <v-btn color="blue" v-on:click="$router.back()" id="back-btn">戻る</v-btn>
</template>

<script>
export default {
  methods: {
    start(user){
      let url_string = window.location.href;
      let url = new URL(url_string);
      let username = url.searchParams.get("username");
      this.$router.push(`/quiz?username=${username}&name=${user}&status=false`)
    }
  }
}
</script>

<style>
.logo{
  position: relative;
  top: 150px;
}

.q-vbt{
  position: relative;
  top: 30%;
  margin-left: auto;
  margin-right: auto;
}

.a-vbt{
  /* position: absolute; */
  position: relative;
  top: 45%;
  margin-left: auto;
  margin-right: auto;
}
</style>