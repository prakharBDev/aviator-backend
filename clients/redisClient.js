const { createClient } = require("redis");
require("dotenv").config();

// Create the Redis client
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

module.exports = redisClient;
