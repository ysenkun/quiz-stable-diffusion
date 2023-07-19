// express will run our server
const express = require("express");
const app = express();
app.use(express.static("public"));

// HTTP will expose our server to the web
const http = require("http").createServer(app);

// decide on which port we will use
const port = process.env.PORT || 3031;

//Server
const server = app.listen(port);
console.log("Server is running on http://127.0.0.1:" + port);

/////SOCKET.IO///////
const io = require("socket.io")(
  http, {
    cors: {
    origin: [""],
    },
  }
).listen(server);

let quiz = {};
quiz['stop_name'] = null;
const fs = require('fs');

function main() {
  setupSocketServer();
}

main();

function setupSocketServer() {
  // Set up each socket connection
  io.on("connection", (socket) => {
    console.log(
      "Peer joined with ID",
      socket.id,
      ". There are " +
      io.engine.clientsCount +
      " peer(s) connected."
    );

    quiz['status'] = 'start'

    socket.on("quiz_status", (data, stop_name) => {
      quiz['status'] = data
      if (quiz['stop_name']!=null && quiz['status']=='stop'){
        console.log('先に回答した人がいます')
      }else{
        quiz['stop_name'] = stop_name
        io.emit("status", quiz);
      }
    });
    
    socket.on("image", (img, prompts) => {
      io.emit("create_image");
      const base64 = img.split(',')[1];
      const decode = new Buffer.from(base64,'base64');
      fs.writeFile('../controlnet/canvas.png', decode, (err) => {
        if(err){
            console.log(err)
        }else{
            console.log('saved');
        }
      });

      var {PythonShell} = require('python-shell');
      var options = {
        pythonPath: '{YOUR_APPROPRIATE_PATH}/control/bin/python', 
        pythonOptions: ['-u'], 
        args: [prompts]
      };
      PythonShell.run('../controlnet/demo.py', options)
        .then(() => {
          console.log('finish')
          io.emit("game_start");
        })
        .catch((error) => {
          console.log(error);
        }
        );
      });
    });
}
