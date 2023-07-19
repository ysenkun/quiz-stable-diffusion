<template>
  <div class="quiz">
    <h1>Guess the AI-generated image!</h1>
    <p>{{ ( stop_name || {} ).xxx }}</p>
    <v-img alt="quiz" :src="image.src" id='quiz-img'></v-img>
    <div v-if="select_pos == 'questioner' && isActive">
        <v-img :src="url" alt="A preview is displayed." id="preview-img"></v-img>
        <label>
            <input type="file" name="example" accept="image/*, image/png, image/heic" ref="image" @change="preview($event)">
            Select an image file
        </label>
        <br>
        prompts: <input v-model="prompts" placeholder="What is this image?">
        <div v-if="prompts && isPreview">
          <v-btn id='send-btn' v-on:click="sendimg">send</v-btn>
        </div>
    </div>
    <div v-if="isStart">
      <div v-if='stop_name!=null'>
        <h3>Respondent:{{stop_name}}</h3>
      </div>
      <div v-if="select_pos == 'questioner'">
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
      <div v-if="stop_name==null">
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
    </div>
    <div v-else-if="!isStart && isCreate" class="load">
      <h1>Generating image</h1>
      <v-progress-circular
        class="route_load"
        indeterminate
        color="blue"
        size="100" 
        width="15"
      ></v-progress-circular>
    </div>
    <div v-else-if="!isStart && select_pos == 'respondent'">
      <h2 style="color:red">Preparing</h2>
    </div>
  </div>
  <v-btn color="blue" v-on:click="$router.back()" id="back-btn">back</v-btn>
  <div v-if="select_pos == 'questioner' && isStart">
    <v-btn color="blue" v-on:click="answer()" id="answer-btn">Answer</v-btn>
  </div>
</template>

<script>
import io from "socket.io-client"
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';

export default {
  data() {
    return{
      image: {},
      game_start: true,
      image_num: 0,
      select_pos: null,
      username: null,
      stop_name: null,
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
    this.select_pos = url.searchParams.get("name");
    this.username = url.searchParams.get("username"); 

    this.sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );
  },
  methods: {
    initSocketConnection() {
      console.log("Initializing socket.io...");
      this.mySocket = io("your_socket_ip");

      this.mySocket.on("connect", () => {
        console.log("My socket ID:", this.mySocket.id);
      });

      this.mySocket.on("status", (quiz) => {
        if (quiz['status'] == 'stop'){
          this.game_start = false;
          this.stop_name = quiz['stop_name'];
        }
        else if(quiz['status'] == 'start') {
          this.stop_name = null;
          this.game_start = true;
          this.start();
        }
        else if(quiz['status'] == 'finish') {
          this.stop_name = null;
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
    async preview(){
      this.isPreview = true;
      var send_image = this.$refs.image.files[0]
      if (send_image.type === 'image/heif' || send_image.type === 'image/heic') {
        send_image = await heic2any({
          blob: send_image,
          toType: 'image/jpeg',
        });
      }
      this.url = URL.createObjectURL(send_image);
    },
    async sendimg(){
      this.send = true;
      this.isActive = false;

      let send_image = this.$refs.image.files[0];
      if (send_image.type === 'image/heif' || send_image.type === 'image/heic') {
        send_image = await heic2any({
          blob: send_image,
          toType: 'image/jpeg',
        });
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 600
      }

      send_image = await imageCompression(send_image ,options);

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
      this.mySocket.emit("quiz_status", "stop", this.username);
    },
    StartClick() {
      this.mySocket.emit("quiz_status", "start", null);
    },
    answer() {
      this.mySocket.emit("quiz_status", "finish", null);
      this.$router.push(`/answer`);
    },
    finish(){
      this.$router.push(`/answer?username=${this.username}`);
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
  top: -30px;
  left: 280px;
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