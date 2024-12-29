const express = require("express");
const router = express.Router();

const { uuid } = require("uuidv4");
const { setKey } = require("../clients/redisClient");

// Mock database
let games = [];

// Create a new game
router.post("/create", async (req, res) => {
  const gameId = uuid();
  // set key in redis
  await setKey(
    gameId,
    JSON.stringify({
      createdAt: new Date().toISOString(),
    })
  );
  res.status(201).json(gameId);
});

// Update an existing game
router.put("/update/:id", (req, res) => {
  const gameId = parseInt(req.params.id);
  const game = games.find((g) => g.id === gameId);

  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  game.name = req.body.name || game.name;
  game.status = req.body.status || game.status;

  res.json(game);
});

module.exports = router;
