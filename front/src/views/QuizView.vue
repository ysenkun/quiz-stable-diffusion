<template>
  <div class="quiz">
    <h1>AIが描いた絵を当てろ!</h1>
    <v-img alt="quiz" :src="image.src" id='quiz-img'></v-img>
    <div v-if="user_name == 'questioner' && isActive">
        <v-img :src="url" alt="ここにプレビューが表示されます" id="preview-img"></v-img>
        <label>
            <input type="file" name="example" accept="image/*, image/png" ref="image" @change="preview($event)">
            画像ファイルを選択
        </label>
        <br>
        prompts: <input v-model="prompts" placeholder="What is this image?">
        <br>
        <div v-if="prompts && isPreview">
          <v-btn id='send-btn' v-on:click="sendimg">送信</v-btn>
        </div>
    </div>
    <div v-if="isStart">
      <div v-if="user_name == 'questioner'">
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
    <div v-else-if="!isStart && isCreate" class="load">
      <h1>画像を生成中</h1>
      <v-progress-circular
        class="route_load"
        indeterminate
        color="blue"
        size="100" 
        width="15"
      ></v-progress-circular>
    </div>
    <div v-else-if="!isStart && user_name == 'respondent'">
      <h2 style="color:red">クイズの準備中</h2>
    </div>
  </div>
  <v-btn color="blue" v-on:click="$router.back()" id="back-btn">戻る</v-btn>
  <div v-if="user_name == 'questioner' && isStart">
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
      user_name: null,
      file: null,
      url: null,
      prompts: null,
      send: false,
      isActive: true,
      isReload: false,
      isStart: false,
      isCreate: false,
      isPreview: false
    }
  },
  mounted() {
    window.addEventListener('load', () => {
      let url_string = window.location.href;
      let url = new URL(url_string);
      let status = url.searchParams.get("status");
      if(status=='true'){
        this.url = null;
        this.isActive = false;
        this.isReload = true;
        this.isStart = true;
      }
    });
    this.initSocketConnection();

    let url_string = window.location.href;
    let url = new URL(url_string);
    this.user_name = url.searchParams.get("name");

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

      this.mySocket.on("create_image", () => {
        this.isCreate = true;
      });

      this.mySocket.on("game_start", () => {
        const urlSearchParams = new URLSearchParams(location.search);
        urlSearchParams.set("status", "true");
        history.replaceState("", "", `?${urlSearchParams.toString()}`);
        location.reload();
      });
    },
    preview(){
      this.isPreview = true;
      let send_image = this.$refs.image.files[0];
      this.url = URL.createObjectURL(send_image);
    },
    async sendimg(){
      this.send = true;
      this.isActive = false;

      let send_image = this.$refs.image.files[0];
      var reader = new FileReader();

      reader.readAsDataURL(send_image);
      await new Promise(resolve => reader.onload = () => resolve());
      let dataUrl = reader.result;
      this.mySocket.emit( 'image', dataUrl, this.prompts );        
    },
    async countdwon(){
      await this.sleep( 1000 );
      for (var name of ['3','2','1','start'] ){
        this.image= {src: require(`../../public/countdown/${name}.png`)};
        await this.sleep( 1000 );
      }
    },
    async start() {
      if (this.isReload){
        await this.countdwon();
        this.isReload = false;
      }
      while (this.game_start) {
        this.image= {src: require(`../assets/quiz_image/${this.image_num}_output.jpeg`)};
        await this.sleep( 2000 );
        this.image_num += 1;
        if (this.image_num >= 19){
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

#preview-img{
  position: relative;
  max-width: 800px;
}

#send-btn{
  position: relative;
  top: 10px
}

.load{
  position: relative;
  top: 10px;
}

.route_load{
  position: relative;
  margin-left: auto;
  margin-right: auto;
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