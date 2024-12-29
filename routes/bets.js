const express = require("express");
const router = express.Router();
const { keyExists, getKey, setKey } = require("../utils/redis");
const { uuid } = require("uuidv4");

/**
 * Controller logic for /bets endpoint
 */

// Get all bets (example)
router.get("/bets", (req, res) => {
  res.send("Get all bets");
});

// Generate random bets (example)
router.get("/generate", (req, res) => {
  const generateRandomUserId = () => Math.floor(Math.random() * 10000);
  const generateRandomBet = () => Math.floor(Math.random() * 91) + 10;

  const currentBets = {};
  for (let i = 0; i < 10; i++) {
    currentBets[generateRandomUserId()] = {
      initialBet: generateRandomBet(),
    };
  }
  res.send(currentBets);
});

// Create a new bet
router.post("/bets", async (req, res) => {
  try {
    const { gameId, userId, betAmount } = req.body;

    // Validate input
    if (!gameId || !userId || !betAmount) {
      return res
        .status(400)
        .send("Missing required fields: gameId, userId, betAmount");
    }

    // Check if game ID exists in Redis
    if (!(await keyExists(gameId))) {
      return res.status(400).send("Invalid game ID");
    }

    // Retrieve existing game data
    const gameDetails = JSON.parse(await getKey(gameId));
    // Initialize bets if not present
    if (!gameDetails.bets) {
      gameDetails.bets = {};
    }
    const betId = uuid();
    // Add the new bet
    gameDetails.bets[betId] = {
      userId,
      betAmount,
      timestamp: new Date().toISOString(),
    };

    // Save the updated game details back to Redis
    await setKey(gameId, JSON.stringify(gameDetails));
    res.status(200).send("Bet added successfully");
  } catch (error) {
    console.error("Error adding bet:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a bet
router.delete("/bets/:id", async (req, res) => {
  try {
    const { id: betId } = req.params;
    const { gameId } = req.body;

    if (!(await keyExists(gameId))) {
      return res.status(400).send("Invalid game ID");
    }

    const gameDetails = JSON.parse(await getKey(gameId));
    if (!gameDetails.bets || !gameDetails.bets[betId]) {
      return res.status(404).send("Bet not found");
    }

    delete gameDetails.bets[betId];
    await setKey(gameId, JSON.stringify(gameDetails));
    res.status(200).send("Bet deleted successfully");
  } catch (error) {
    console.error("Error deleting bet:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
