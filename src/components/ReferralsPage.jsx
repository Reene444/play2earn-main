import React, { useState, useEffect } from "react";
import "./css/Referrals.css";
import { FaUserFriends } from "react-icons/fa";
import { FaBitcoin } from "react-icons/fa";
import { FaClipboard } from "react-icons/fa";
import referralsIcon from "/assets/icon2.png";
import hands from "/assets/hands.png";
import cards from "/assets/cards.png";
import check from "/assets/check.png";
import Header from "./header";
import Footer from "./footer";
import axios from "axios";

const ReferralsPage = () => {
  const email = sessionStorage.getItem("email");
  const [referralCode, setReferralCode] = useState("");
  const [refCount, setRefCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(email);
  useEffect(() => {
    async function fetchReferralInfo() {
      try {
        const API_BASE_URL =
          process.env.NODE_ENV === "development"
            ? "http://localhost:5002"
            : "https://sjq6s9ict5.execute-api.eu-north-1.amazonaws.com/dev";
        const apiUrl = `${API_BASE_URL}/api/user/${email}/referral-info`;
        const response = await axios.get(apiUrl, { withCredentials: true });
        console.log(email);
        setReferralCode(response.data.refnum || "No referral code available");
        setRefCount(
          response.data.referredUsersCount || "No referral code available"
        );
        setLoading(false); // Disable loading state after fetching data
      } catch (error) {
        console.error("Failed to fetch referral info:", error);
        setError(error.message);
        setLoading(false); // Disable loading state even on error
      }
    }
    fetchReferralInfo(); // Call the async function
  }, [email]); // Dependency array ensures it runs when userId changes
  const handleCopy = () => {
    navigator.clipboard
      .writeText(referralCode)
      .then(() => {
        alert("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Header />
      <div className="referrals-container">
        <main>
          <div className="content-container">
            {/* Referrals Box */}
            <div className="referrals-box">
              <img
                src={referralsIcon}
                alt="Referrals Icon"
                className="referrals-icon"
              />
              <span>Referrals</span>
            </div>
            <h1 className="reff_h1 text-2xl">
              Earn a 10% Lifetime Bonus by referring to your friends!
            </h1>
            <div className="instructions">
              <h4>Instructions to follow:</h4>
              <ol>
                <li className=" text-black ">
                  <span className="number-circle">1</span>Share Your Referral
                  Code with Friends.
                </li>
                <li className=" text-black ">
                  <span className="number-circle">2</span>Invite Friends to Sign
                  Up: They Receive a 10% Bonus on Their First Completed Task.
                </li>
                <li className=" text-black ">
                  <span className="number-circle">3</span>You Will Earn a 10%
                  Bonus for Every Task Your Friends Complete!
                </li>
              </ol>
            </div>
            <div className="referral-code-container">
              <div className="referral-code-container">
                <h4>Your Referral Code</h4>
                <div className="code-box">
                  <span>{referralCode}</span>
                </div>
                <button
                  className="copy-button refrall_btn"
                  onClick={handleCopy}
                >
                  <FaClipboard /> Copy
                </button>
              </div>
            </div>
            <h3 className="bonus-text reff_h3">
              Have a Bonus code from your friend?
            </h3>

            <div className="summary-illustrations-container">
              <div className="summary-container">
                <h4>Your Summary</h4>
                <div className="summary">
                  <div className="summary-item">
                    <span>Referred Friends:</span>
                    <FaUserFriends size={32} color="blue" />
                    <span>{refCount}</span>
                  </div>
                  <div className="summary-item">
                    <span>Bonus Earned:</span>
                    <FaBitcoin size={32} color="blue" />
                    <span>{refCount * 100}</span>
                  </div>
                </div>
              </div>

              <div className="illustrations">
                <img
                  className="illustration-center"
                  src={hands}
                  alt="Hands exchanging"
                />
                <img className="cards-image" src={cards} alt="cards" />
                <img className="checklist-image" src={check} alt="Checklist" />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ReferralsPage;
