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
    origin: ["https://yulon.cps.akita-pu.ac.jp/ws"],
    },
  }
).listen(server);

let quiz = {};

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

    socket.on("quiz_status", (data) => {
      quiz['status'] = data
      io.emit("status", quiz);
    });
  })
}
