const socketIo = require("socket.io");
require("dotenv").config();

/**
 * Utility function to emit events with error handling
 */
const emitEvent = (socket, eventName, data) => {
  try {
    socket.emit(eventName, data);
    console.log(`Event emitted: ${eventName}`, data);
  } catch (error) {
    console.error(`Error emitting event ${eventName}:`, error.message);
  }
};

/**
 * Utility function to handle incoming events with error handling
 */
const onEvent = (socket, eventName, callback) => {
  try {
    socket.on(eventName, async (data) => {
      try {
        console.log(`Event received: ${eventName}`, data);
        await callback(data, socket);
      } catch (error) {
        console.error(
          `Error in event handler for ${eventName}:`,
          error.message
        );
        emitEvent(socket, "error", {
          message: `Failed to handle ${eventName}`,
        });
      }
    });
  } catch (error) {
    console.error(
      `Error setting up listener for event ${eventName}:`,
      error.message
    );
  }
};

/**
 * Main event handler for the socket
 */
const eventHandler = (socket) => {
  // Example of emitting a welcome message
  emitEvent(socket, "message", "Welcome to the Game!");

  // Handle startGame event
  onEvent(socket, "startGame", () => {
    try {
      const generateRandomUserId = () => Math.floor(Math.random() * 10000);
      const generateRandomBet = () => Math.floor(Math.random() * 91) + 10;

      const currentBets = {};
      for (let i = 0; i < 10; i++) {
        currentBets[generateRandomUserId()] = {
          initialBet: generateRandomBet(),
        };
      }

      console.log("Sending start game event");
      emitEvent(socket, "startGame", currentBets);
    } catch (error) {
      console.error("Error generating start game bets:", error.message);
      emitEvent(socket, "error", { message: "Failed to start the game" });
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
};

/**
 * Setup connection handler
 */
const handleConnection = (io) => {
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);
    eventHandler(socket);
  });
};

/**
 * Initialize the socket.io server
 */
const socketHandler = (server) => {
  try {
    const io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
      },
    });
    handleConnection(io);
    console.log("Socket.IO server initialized");
  } catch (error) {
    console.error("Error initializing Socket.IO server:", error.message);
  }
};

module.exports = { socketHandler, emitEvent, onEvent };
