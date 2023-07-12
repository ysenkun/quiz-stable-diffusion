<template>
  <div class="quiz">
    <h1>AIが書いた絵を当てろ!</h1>
    <v-img alt="quiz" :src="image.src" id='quiz-img'></v-img>
    <v-row justify="center">
    <v-fab-transition>
        <v-btn
          class="fab-btn"
          color="#ff0000"
          icon="mdi-chevron-up"
          height="200"
          width="200"
          absolute center
          @click="stop"
        >STOP</v-btn>
      </v-fab-transition>
    </v-row>
  </div>
  <v-btn color="blue" v-on:click="$router.back()" id="back-btn">戻る</v-btn>
</template>

<script>
import io from "socket.io-client"
export default {
  data() {
    return{
      image: {},
      game_start: true,
      image_num: 6,
    }
  },
  mounted() {
    this.initSocketConnection();

    this.sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );
    this.start();
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
        console.log(quiz)
        this.game_start = false;
      });
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
    stop() {
      this.game_start = false;
      this.mySocket.emit("quiz_status", "stop");
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

.fab-btn {
  position: relative;
  top: 50px;
}

#back-btn{
  position: absolute;
  bottom: 10px;
}
</style>