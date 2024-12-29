const redisClient = require("../clients/redisClient");

// Function to set a key-value pair in Redis
const setKey = async (key, value) => {
  try {
    const reply = await redisClient.set(key, value);
    console.log("Set key in Redis:", reply);
    return reply;
  } catch (error) {
    console.error("Error setting key in Redis:", error);
    throw error;
  }
};

// Function to get a value by key from Redis
const getKey = async (key) => {
  try {
    const reply = await redisClient.get(key);
    console.log("Got key from Redis:", reply);
    return reply;
  } catch (error) {
    console.error("Error getting key from Redis:", error);
    throw error;
  }
};

// Function to delete a key from Redis
const deleteKey = async (key) => {
  try {
    const reply = await redisClient.del(key);
    console.log("Deleted key from Redis:", reply);
    return reply;
  } catch (error) {
    console.error("Error deleting key from Redis:", error);
    throw error;
  }
};

// Function to check if a key exists in Redis
const keyExists = async (key) => {
  try {
    const reply = await redisClient.exists(key);
    console.log("Key exists in Redis:", reply);
    return reply === 1; // 1 if key exists, 0 otherwise
  } catch (error) {
    console.error("Error checking key existence in Redis:", error);
    throw error;
  }
};

module.exports = {
  setKey,
  getKey,
  deleteKey,
  keyExists,
};
