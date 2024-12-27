const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001", // Adjust to your frontend URL
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

const generateRandomUserId = () => Math.floor(Math.random() * 10000);
const generateRandomBet = () => Math.floor(Math.random() * 91) + 10;

const currentBets = {};
for (let i = 0; i < 10; i++) {
  currentBets[generateRandomUserId()] = {
    initialBet: generateRandomBet(),
  };
}
console.log(currentBets);
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  // Example of emitting an event to the client
  socket.emit("message", "Welcome to the server!");
  socket.on("startGame", () => {
    console.log("Game started");
    socket.emit("startGame", currentBets);
  });
  // Example of listening to an event from the client
  socket.on("clientEvent", (data) => {
    console.log("Received data from client:", data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
