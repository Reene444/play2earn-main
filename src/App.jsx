import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Chatbox from "./components/Chatbot";
import "./App.css";
import Login from "./components/Login";
import HelpAndSupport from "./components/helpAndSupport";
import Earn from "./components/Earn";
import ReferralsPage from "./components/ReferralsPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import About from "./components/about.jsx";
import Leaderboard from "./components/leaderboard";
import AdminDashboard from "./components/Admin-dash/AdminDashboard";
import ScrollToTop from "./components/ui/ScrollToTop";
import Survey from "./components/surveyTasks/survey";
import Wordify from "./components/Wordify/Wordify";
import FollowTask from "./components/FollowTask/FollowTask";
import AudioTranscription from "./components/Audios/AudioTranscription";
import Translation from "./components/Translation/translation";
import ImageCaption from "./components/ImageCaption/imagecaption";
import Captcha from "./components/captcha/Captcha";
import TextTagging from "./components/TextTagging/TextTaggingGame";
import Wizard from "./components/wizardTask/wordCountChallenge";
import CVUploadingPage from "./components/CvAnalysis/CVUploadingPage";
import ProjectDescriptionForm from "./components/CvAnalysis/ProjectDescriptionFrom";
import TalentsFound from "./components/CvAnalysis/TalentsFound/TalentsFound";
import CVLandingPage from "./components/CvAnalysis/LandingPage/LandingPage";
import { AuthProvider } from "./components/globalStateForAuth";
import UserDash from "./components/user_dash/userdash";
import { AuthContext } from "./components/globalStateForAuth";
import axios from "axios";
// (admin dash) mit prajapati
import SearchAndCapture from "./components/SearchAndCapture/Main";
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  // mit prajapati
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { userLoginStatus, setUserLoginStatus } = useContext(AuthContext);
  const userLoginStatusAppr = () => {
    setUserLoginStatus(true);
    // console.log(userLoginStatus);
  };

  useEffect(() => {
    // Check if the user is authenticated when the page loads
    async function checkAuth() {
      try {
        const API_BASE_URL =
          process.env.NODE_ENV === "development"
            ? "http://localhost:5002" // Use backend API port in development
            : "https://sjq6s9ict5.execute-api.eu-north-1.amazonaws.com/dev";

        const apiUrl = `${API_BASE_URL}/api/check`;

        const response = await axios.get(apiUrl, {
          withCredentials: true, // Include credentials like cookies
          headers: {
            "Content-Type": "application/json", // Set appropriate headers
          },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
          userLoginStatusAppr();
        } else if (response.status === 403) {
          console.log("user is not logged in");
        } else {
          // console.log("no");
          setIsAuthenticated(false); // User is not authenticated
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false); // Error, assume user is not authenticated
      }
    }

    checkAuth();
  }, []);

  return (
    // <AuthProvider>
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* <div>{isAuthenticated ? "Authenticated" : "Not Authenticated"}</div> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/translation" element={<Translation />} />
          <Route path="/imagecaption" element={<ImageCaption />} />
          <Route path="/captcha" element={<Captcha />} />
          <Route path="/texttagging" element={<TextTagging />} />
          <Route path="/Wordify" element={<Wordify />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/FollowTask" element={<FollowTask />} />
          <Route path="/AudioTranscription" element={<AudioTranscription />} />
          <Route path="/searchandcapture" element={<SearchAndCapture />} />
          
          <Route path="/cv-home" element={<CVLandingPage />} />
          <Route path="/uploadCV" element={<CVUploadingPage />} />
          <Route path="/recruit" element={<ProjectDescriptionForm />} />
          <Route path="/talents-found" element={<TalentsFound />} />
          <Route path="/userdash" element={<UserDash />} />
          {/* Add other routes here */}

          {/* foorter routes */}
          <Route path="/about" element={<About />} />
          <Route path="/help-and-support" element={<HelpAndSupport />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        </Routes>
        {/*<Chatbox />*/}
        <Chatbox />
        <ScrollToTop />
      </div>
    </Router>
  );
};

export default App;
