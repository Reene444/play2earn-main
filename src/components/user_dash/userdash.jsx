import React, { useState, useEffect } from "react";
import "./style/userdash.css";
import Header from "../header";
import Footer from "../footer";
import userlogo from "./img/user.png";
import Card from "./component/card";
import axios from "axios";

const UserDash = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [showMoreU, setShowMoreU] = useState(false);
  const [showMoreD, setShowMoreD] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    async function User_dash_data() {
      try {
        const API_BASE_URL =
          process.env.NODE_ENV === "development"
            ? "http://localhost:5002"
            : "https://sjq6s9ict5.execute-api.eu-north-1.amazonaws.com/dev";

        const apiUrl = `${API_BASE_URL}/api/users/user_data`;
        const response = await axios.post(apiUrl, null, {
          withCredentials: true,
        });

        setUserData(response.data); // Set user data from response
        setLoading(false); // Disable loading state
        // console.log(response.data); // Debugging the fetched data
      } catch (error) {
        console.log(error);
        setLoading(false); // Disable loading even on error
      }
    }

    User_dash_data(); // Call the function
  }, []); // Empty array ensures the effect runs only on component mount

  const showMoreResetU = () => {
    console.log(showMoreD)
    setShowMoreU((prevState) => !prevState);
  };
  const showMoreResetD = () => {
    console.log(showMoreD)
    setShowMoreD((prevState) => !prevState);
  };

  if (loading) {
    return <div>Loading User Data...</div>; // Show loading message while fetching
  }

  return (
    <>
      <Header />
      <div className="">
        {userData ? (
          <>
            <div className="mt-12 ml-7 flex flex-col items-center justify-center">
              <h1 className="text-black text-3xl text-center lg:text-center">
                {userData.firstName}, Welcome to <b>Play2earn</b>.
              </h1>
              <h4 className="text-black text-center lg:text-center mt-2">
                Are you ready to earn cryptocurrency tokens by completing tasks?
              </h4>
            </div>

            <div className="main_body_usd mt-7">
              <div className="w-full lg:w-4/5 pl-4 lg:mx-auto flex flex-col lg:flex-row justify-center lg:justify-between">
                {/* Left Sidebar */}
                <div className="w-full lg:w-1/4 mb-6 lg:mr-10 lg:mb-0">
                  {/* User Overview */}
                  <div className="border-solid border-2 border-gray-300 rounded-xl mb-6 p-4">
                    <img
                      src={userlogo}
                      alt="user_logo"
                      className="w-20 lg:w-28 m-auto"
                    />

                    <p className="text-sm text-left mt-6">
                      Name: {userData.firstName} {userData.lastName}
                    </p>
                    <p className="text-sm text-left mt-6">
                      Email: {userData.email}
                    </p>
                    <p className="text-sm text-left mt-6">
                      Current level: {userData.level}
                    </p>
                    <p className="text-sm text-left mt-6">
                      Participating-task: {userData.task_participated}
                    </p>
                  </div>

                  {/* Earning Overview */}
                  <div className="border-solid border-2 border-gray-300 rounded-xl mb-6 p-4">
                    <h3 className="text-xl text-center">Earning Overview</h3>
                    <p className="text-sm text-left mt-6">
                      Total-earned: {userData.total_rewards}
                    </p>
                    <p className="text-sm text-left mt-3">View transactions</p>
                  </div>

                  {/* AI Contribution */}
                  <div className="border-solid border-2 border-gray-300 rounded-xl p-4">
                    <h3 className="text-xl text-center">Ai Contribution</h3>
                    <p className="text-sm text-left mt-6">
                      Task Completed: {userData.tasks_completed}
                    </p>
                    <p className="text-sm text-left mt-3">
                      Ai model improved: {userData.aiModelImproved}
                    </p>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full lg:w-3/4">
                  {/* Participated Tasks */}
                  <div className="border-solid border-2 border-gray-300 rounded-xl mb-6 p-4">
                    <h2 className="text-3xl mb-9 text-center">
                      Participated Tasks
                    </h2>
                    <div className="flex flex-wrap justify-center ">
                      <Card />
                      <Card />

                      {showMoreU ? (
                        <>
                          <Card />
                          <Card />
                          <Card />
                          <Card />
                        </>
                      ) : null}
                    </div>
                    <a
                      className="cursor-pointer px-4 py-2 text-white rounded-3xl bg-blue-500 hover:bg-blue-700"
                      onClick={showMoreResetU}
                    >
                      Show {showMoreU ? "Less-" : "More+"}
                    </a>
                  </div>

                  {/* Upcoming Tasks */}
                  <div className="border-solid border-2 border-gray-300 rounded-xl p-4">
                    <h2 className="text-3xl mb-9 text-center">
                      Upcoming Tasks
                    </h2>
                    <div className="flex flex-wrap justify-center">
                      <Card />
                      <Card />
                      {showMoreD ? (null) : (
                        <>
                          <Card />
                          <Card />
                          <Card />
                          <Card />

                        </>)}

                    </div>
                    <a
                      className="cursor-pointer px-4 py-2 text-white rounded-3xl bg-blue-500 hover:bg-blue-700"
                      onClick={showMoreResetD}
                    >
                      Show {showMoreD ? "Less-" : "More+"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>Loading User Data...</div> // Fallback for when data hasn't loaded yet
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserDash;
