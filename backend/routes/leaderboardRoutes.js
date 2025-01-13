const express = require("express");
const router = express.Router();
const { getLeaderboardData, addLeaderboardEntry } = require("../controllers/leaderBoardController");

router.get("/leaderBoardData", (req, res) => {
  const cacheDb = req.cacheDb;
  getLeaderboardData(req, res, cacheDb);
});

// 
router.post("/AddEntry", addLeaderboardEntry);

module.exports = router;