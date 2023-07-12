<template>
  <div class="quiz">
    <h1>AIが書いた絵を当てろ!</h1>
    <v-img alt="quiz" :src="image.src" id='quiz-img'></v-img>
    <div v-if="questioner">
      <v-img :src="url" alt="ここにプレビューが表示されます"></v-img>
      <label>
          <input type="file" name="example" accept="image/*, image/png" ref="image" @change="preview($event)">
          画像ファイルを選択
      </label>
      <br>
      prompts: <input v-model="prompts" placeholder="What is this image?">
      <br>
      <v-btn id='send-btn' v-on:click="sendimg">送信</v-btn>
      <v-row justify="center">
        <v-fab-transition>
          <v-btn
            class="q-fab-btn"
            color="#1e90ff"
            icon="mdi-chevron-up"
            height="150"
            width="150"
            absolute center
            @click="StartClick"
          >START</v-btn>
        </v-fab-transition>
      </v-row>
    </div>
    <v-row justify="center">
    <v-fab-transition>
        <v-btn
          class="a-fab-btn"
          color="#ff0000"
          icon="mdi-chevron-up"
          height="150"
          width="150"
          absolute center
          @click="StopClick"
        >STOP</v-btn>
      </v-fab-transition>
    </v-row>
  </div>
  <v-btn color="blue" v-on:click="$router.back()" id="back-btn">戻る</v-btn>
  <div v-if="questioner">
    <v-btn color="blue" v-on:click="answer()" id="answer-btn">答え</v-btn>
  </div>
</template>

<script>
import io from "socket.io-client"

export default {
  data() {
    return{
      image: {},
      game_start: true,
      image_num: 0,
      questioner: false,
      file: null,
      url: null,
      prompts: null,
    }
  },
  mounted() {
    this.initSocketConnection();

    let url_string = window.location.href;
    let url = new URL(url_string);
    var user_name = url.searchParams.get("name");
    if (user_name == 'questioner'){
      this.questioner = true
    }

    this.sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );
  },
  methods: {
    initSocketConnection() {
      console.log("Initializing socket.io...");
      this.mySocket = io("https://yulon.cps.akita-pu.ac.jp");

      this.mySocket.on("connect", () => {
        console.log("My socket ID:", this.mySocket.id);
      });

      this.mySocket.on("status", (quiz) => {
        if (quiz['status'] == 'stop'){
          this.game_start = false;
        }
        else if(quiz['status'] == 'start') {
          this.game_start = true;
          this.start();
        }
        else if(quiz['status'] == 'finish') {
          this.game_start = false;
          this.finish();
        }
      });
    },
    preview(){
      let image = this.$refs.image.files[0]
      this.url = URL.createObjectURL(image);
    },
    async sendimg(){
      let image = this.$refs.image.files[0]

      var reader = new FileReader();

      reader.readAsDataURL(image)
      await new Promise(resolve => reader.onload = () => resolve());
      let dataUrl = reader.result
      this.mySocket.emit( 'image', dataUrl, this.prompts );        
    },
    async start() {
      while (this.game_start) {
        this.image= {src: require(`../../public/quiz_image/${this.image_num}_output.jpeg`)};
        await this.sleep( 1000 );
        this.image_num += 1;
        if (this.image_num >= 20){
          break
        }
      }
    },
    StopClick() {
      this.game_start = false;
      this.mySocket.emit("quiz_status", "stop");
    },
    StartClick() {
      this.mySocket.emit("quiz_status", "start");
    },
    answer() {
      this.mySocket.emit("quiz_status", "finish");
      this.$router.push(`/answer`);
    },
    finish(){
      this.$router.push(`/answer`);
    }
  }
}
</script>

<style>
label {
    padding: 5px 5px;
    color: #ffffff;
    background-color: #696969;
    cursor: pointer;
}

input[type="file"] {
    display: none;
}

#send-btn{
  position: relative;
  top: 10px
}

#quiz-img{
  position: relative;
  width: 98%;
  margin-left: auto;
  margin-right: auto;
}

.q-fab-btn {
  position: relative;
  top: 30px;
}

.a-fab-btn {
  position: relative;
  top: 50px;
}

#back-btn{
  position: absolute;
  bottom: 10px;
}

#answer-btn{
  position: absolute;
  bottom: 10px;
  right: 0px;
}
</style>