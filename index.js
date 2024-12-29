const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const { socketHandler } = require("./clients/socketClient");
const redisClient = require("./clients/redisClient");

const PORT = process.env.PORT || 3000;

// Gracefully handle shutdown
const gracefulShutdown = (server) => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
    redisClient.quit(() => {
      console.log("Redis client disconnected.");
      process.exit(0);
    });
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("Forcing shutdown...");
    process.exit(1);
  }, 10000);
};

const startServer = async () => {
  try {
    const app = express();
    // Connecting to redis
    await redisClient.connect();

    const server = http.createServer(app);

    app.use(cors());
    app.use(bodyParser.json());
    app.use("/bets", require("./routes/bets"));

    // starting the socket server
    socketHandler(server);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    redisClient.on("error", (err) => {
      console.error("Could not establish a connection with Redis. Exiting...");
      console.error(err);
      process.exit(1);
    });

    // Ensure gracefulShutdown is passed as a reference, not invoked immediately
    process.on("SIGTERM", () => gracefulShutdown(server));
    process.on("SIGINT", () => gracefulShutdown(server));
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

// Connect the client
(async () => {
  try {
    console.log("Starting the Server");
    startServer();
  } catch (err) {
    console.error("Failed to start the server", err);
  }
})();
