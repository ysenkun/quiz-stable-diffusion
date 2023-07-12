<template>
  <div class="quiz">
    <h1>AIが書いた絵を当てろ!</h1>
    <v-img alt="quiz" :src="image.src" id='quiz-img'></v-img>
    <div v-if="questioner">
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
      console.log(this.mySocket)

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
    async start() {
      console.log('start_now')
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