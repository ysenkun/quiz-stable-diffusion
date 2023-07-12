<template>
  <v-btn block rounded="xl" size="large" height="72" min-width="364" class="q-vbt" v-on:click="start">出題者</v-btn>
  <v-btn block rounded="xl" size="large" height="72" min-width="364" class="a-vbt" v-on:click="start">回答者</v-btn>

</template>

<script>
export default {
  methods: {
    start(){
      this.$router.push(`/quiz?name=user`)
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
  /* position: absolute; */
  position: relative;
  top: 50%;
  margin-left: auto;
  margin-right: auto;
}

.q-vbt{
  /* position: absolute; */
  position: relative;
  bottom: -50%;
  margin-left: auto;
  margin-right: auto;
}
</style>