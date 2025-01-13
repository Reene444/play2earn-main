import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap,
  Target,
  Swords,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "./header";
import Footer from "./footer";
import axios from "axios";

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [animatedPoints, setAnimatedPoints] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [userData, setUserData] = useState([]); // Empty array as default
  const usersPerPage = 5;

  useEffect(() => {
    async function LeaderBoardData() {
      try {
        const API_BASE_URL =
          process.env.NODE_ENV === "development"
            ? "http://localhost:5002"
            : "https://sjq6s9ict5.execute-api.eu-north-1.amazonaws.com/dev";

        const apiUrl = `${API_BASE_URL}/api/leaderboard/leaderBoardData`;
        const response = await axios.get(apiUrl);

        setUserData(response.data); // Set user data from response
        setLoading(false); // Disable loading state
        // console.log(response.data);  // Debugging the fetched data
      } catch (error) {
        console.log(error);
        setLoading(false); // Disable loading even on error
      }
    }

    LeaderBoardData(); // Call the function
  }, []);

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(userData.length / usersPerPage);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (userData.length === 0) {
    return <div>No data available</div>; // Display when no data is present
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-blue-100 text-blue-800 overflow-hidden relative">
      {/* Header */}
      <Header />
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-blue-200 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-6xl font-extrabold text-center mb-8 animate-pulse text-blue-600">
          Epic Gamers Arena
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white/70 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-blue-700">
              <Target className="mr-2" /> Daily Challenge
            </h2>
            <p className="text-blue-600">
              Complete 3 quests to earn bonus points!
            </p>
            <div className="mt-4 h-4 bg-blue-100 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: "66%" }}
              ></div>
            </div>
            <p className="text-right mt-2 text-blue-600">2/3 completed</p>
          </div>
          <div className="bg-white/70 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-blue-700">
              <Crown className="mr-2" /> Current Champion
            </h2>
            <p className="text-3xl font-bold text-blue-600">DragonSlayer</p>
            <p className="text-blue-500">Ruling for: 3 days</p>
          </div>
          <div className="bg-white/70 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-blue-700">
              <Swords className="mr-2" /> Next Tournament
            </h2>
            <p className="text-3xl font-bold text-green-600">2d 7h 15m</p>
            <p className="text-blue-500">Prize pool: 10,000 coins</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-700">
            Leaderboard Elite
          </h2>
          {currentUsers.map((user, index) => (
            <div
              key={user.username}
              className="mb-6 bg-blue-50 rounded-xl overflow-hidden shadow-md transform transition-all duration-300 hover:scale-105 hover:rotate-1"
            >
              <div className="flex items-center justify-between p-4 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-100/50 to-blue-200/50 transform skew-x-12 -z-10"></div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-extrabold text-3xl border-4 border-blue-200 transform rotate-12">
                    {indexOfFirstUser + index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-blue-700">
                      {user.username}
                    </p>
                    <p className="text-blue-500">Level {user.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-4xl text-blue-600 animate-bounce">
                    {animatedPoints[user.username] || user.points}
                  </p>
                  <p className="text-blue-500">points</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-blue-100 flex justify-between items-center">
                <div className="flex items-center">
                  <Zap className="text-yellow-500 mr-2" />
                  <span className="text-blue-600">
                    Streak: {user.streak} days
                  </span>
                </div>
                <div>
                  <span className="bg-blue-200 text-xs font-bold rounded-full px-3 py-1 text-blue-700">
                    {user.achievements} Achievements
                  </span>
                </div>
              </div>
              <div className="bg-blue-200 h-2 w-full">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-full"
                  style={{ width: `${(user.points / 10000) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-6">
            <Button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Leaderboard;
