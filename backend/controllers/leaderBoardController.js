const fs = require('fs');
const path = require('path');
const Leaderboard = require("../models/leaderboard");
const Datastore = require('nedb');

const CACHE_DIR = path.join(__dirname, '..', 'cache');


const ensureCacheDirExists = () => {
    try {
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      } 
    } catch (err) {
      console.error(`Error creating cache directory: ${err.message}`);
    }
  };
  

const getCacheDb = (workerId) => {
  ensureCacheDirExists(); 
  const cacheFilePath = path.join(CACHE_DIR, `cache_worker_${workerId}.db`);
  return new Datastore({ filename: cacheFilePath, autoload: true });
};


const checkAndInitializeCache = (cacheDb) => {
  return new Promise((resolve, reject) => {
    cacheDb.findOne({ _id: 'leaderboard' }, (err, doc) => {
      if (err) return reject(err);
      if (!doc) {
        cacheDb.insert({ _id: 'leaderboard', data: [] }, (err) => {
          if (err) return reject(err);
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};

const getLeaderboardData = async (req, res, cacheDb) => {
  try {
    await checkAndInitializeCache(cacheDb);
    cacheDb.findOne({ _id: 'leaderboard' }, async (err, cachedData) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (cachedData && cachedData.data.length > 0) {
        return res.json(cachedData.data);
      }

      const data = await Leaderboard.find().sort({ total_rewards: -1 }).exec();
      const rankedData = data.map((entry, index) => ({
        rank: index + 1,
        username: entry.username,
        points: entry.total_rewards,
      }));

      cacheDb.update({ _id: 'leaderboard' }, { _id: 'leaderboard', data: rankedData }, { upsert: true }, (err) => {
        if (err) return res.status(500).json({ message: "Server error" });
      });

      return res.json(rankedData);
    });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const addLeaderboardEntry = async (req, res) => {
  const { username, points } = req.body;

  try {
    const newEntry = new Leaderboard({ username, total_rewards: points });
    await newEntry.save();
    console.log("New entry added to the leaderboard");

    return res.status(201).json({ message: "Leaderboard updated successfully" });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getLeaderboardData, addLeaderboardEntry, getCacheDb };