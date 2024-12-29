const express = require("express");
const router = express.Router();

const betsRouter = require("./bets");
const gameRouter = require("./game");

router.use("/bets", betsRouter);
router.use("/game", gameRouter);

module.exports = router;
