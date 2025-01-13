const mongoose = require("mongoose")
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const followTaskRouter = require("./routes/FollowTaskRouter");
const textTagRoutes = require("./routes/TextTagRouter");
const wordcountRoutes = require("./routes/wordcountRoutes");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
// leaderboard (mit prajapati)
const leaderboardRouter = require("./routes/leaderboardRoutes");
const os = require('os');
const cluster = require('cluster')

// reff (mit prajapati)
const fetchdataRoutes = require("./routes/fetchdataRoutes");

// admin (mit prajapati)
const dataRoutes = require('./routes/dataRoutes');
const tasksCompletedRoutes = require('./routes/tasksCompletedRoutes');
const totalRewardsRoutes = require('./routes/totalRewardsRoutes');
const taskCompletedOverTimeRoutes = require('./routes/taskcompletedovertimeRoutes');
const newregistrationRoutes = require('./routes/newregistrationRoutes');
const topfivegameRoutes = require('./routes/topfivegameRoutes');

// user progress (mit prajapati)
const progressRoutes = require('./routes/progressRoutes');


require("dotenv").config();
const bodyParser = require("body-parser");
const texts = require("./model/texts.json"); // Correct path to your texts.json

const express = require("express");
const server = express(); // Changed from app to server

// leaderboard (mit prajapati)
const numCPUs = os.cpus().length;
// Warning handler , remove warning for nedb: if maintain the leaderboard apis for long time, suggest add other external cache db instead of nedb
const process = require('process');
process.removeAllListeners('warning')


if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });

} else {
  const server = express();
  server.use(cookieParser());

  // Middleware
  // Middleware
  const corsOptions = {
    origin: [
      "https://www.play2earn.ai", // Production frontend URL
      "https://dev.d3sxwpggtsq5rq.amplifyapp.com", // Amplify dev URL
      "http://localhost:5173", // Local development URL
    ],
    credentials: true,
  };
  server.use(cors(corsOptions));

  server.use(express.json());
  server.use(bodyParser.json());

  // MongoDB connection
  mongoose.connect("mongodb+srv://p2etokens:Play2earn%40@cluster0.hfnr9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB", err));

  // Initialize Cache Database for the worker
  const { getCacheDb } = require("./controllers/leaderBoardController");
  const cacheDb = getCacheDb(cluster.worker.id);

  // Inject cacheDb into routes
  server.use((req, res, next) => {
    req.cacheDb = cacheDb;
    next();
  });

  // Routes
  server.use("/api/auth", authRoutes);
  server.use("/api/tasks", taskRoutes);
  server.use("/api/admin", adminRoutes);
  server.use("/api/users", userRoutes);
  server.use("/api/follow-task", followTaskRouter);
  server.use("/api/leaderboard", leaderboardRouter);
  server.use("/api/texttag", textTagRoutes)
  server.use("/api/wordcount", wordcountRoutes)

  //  ref (mit prajapati)
  server.use("/api", fetchdataRoutes);


  // admin (mit prajati)

  server.use('/api', dataRoutes);
  server.use('/api', tasksCompletedRoutes);
  server.use('/api', totalRewardsRoutes);
  server.use('/api', taskCompletedOverTimeRoutes);
  server.use('/api', newregistrationRoutes);
  server.use('/api', topfivegameRoutes);

  // user progress (mit prajapati)
  server.use('/api/progress', progressRoutes);

  // this is for the authentication to checking cookies
  server.get("/api/check", (req, res) => {
    // console.log("Request received at /check");
    // console.log("Cookies:", req.cookies.token);
    const token = req.cookies.token;

    try {

      if (!token) {
        return res
          .status(403)
          .json({ message: "No token, authentication failed" });
      }

      const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
      return res
        .status(200)
        .json({ message: "Authenticated", user: verifiedUser });
    } catch (err) {
      console.error("Server error:", err);
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Function to generate a paragraph
  server.get("/generate_paragraph", (req, res) => {
    const { level, user_id } = req.query;

    // Validate query parameters
    if (!level || !texts[level]) {
      return res.status(400).json({ error: "Invalid level or level not found." });
    }

    const sentences = texts[level];
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const sentence = sentences[randomIndex];

    res.json({
      french: sentence.french,
      english: sentence.english,
      hearts: 3, // Example initial hearts count
    });
  });

  // Function to verify translation
  server.post("/verify", (req, res) => {
    const { user_translation, correct_translation, user_id, level } = req.body;

    // Validate request body
    if (!user_translation || !correct_translation || !user_id || !level) {
      console.error("Missing required fields:", {
        user_translation,
        correct_translation,
        user_id,
        level,
      });
      return res.status(400).json({
        error:
          "User translation, correct translation, user_id, and level are required.",
      });
    }

    // Check if user translation is correct
    const isCorrect =
      user_translation.trim().toLowerCase() ===
      correct_translation.trim().toLowerCase();

    res.json({
      is_correct: isCorrect,
    });
  });


  // Server setup
  const PORT = process.env.PORT || 5002;
  server.listen(PORT, () => console.log(`Worker ${cluster.worker.id} running on port ${PORT}`));

}

