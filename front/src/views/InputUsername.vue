<template>
  <v-sheet class="bg-blue pa-12" id="input-sheet" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          v-model="username"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="user name"
          class="custom-text-field"
        ></v-text-field>

        <br>
        <v-btn
          :disabled="!username"
          :loading="loading"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Enter the room
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
  <v-btn color="blue" v-on:click="$router.back()" id="back-btn">back</v-btn>
</template>

<script>
export default {
  data() {
    return {
      form: false,
      loading: false,
      username: null,
    }
  },
  mounted(){
    let url_string = window.location.href;
    let url = new URL(url_string);
    this.username = url.searchParams.get("username");
    if (this.username=='null'){
      this.username = null
    }
  },
  methods: {
    onSubmit () {
      this.$router.push(`/select?username=${this.username}`)
    },
  }
}
</script>

<style>
#input-sheet{
  position: relative;
  width: 90%;
  max-width: 500px;
  top: 30%;
  margin-left: auto;
  margin-right: auto;
}

.custom-text-field .v-label {
  color: gray;
  background-color: transparent !important;
}
</style>

