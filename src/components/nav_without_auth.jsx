import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
import default_user_logo from "/assets/user.png";
import "./css/without_auth.css";
// importing connecting wallet component that will return connect button and status of the wallet
// the component will be included in the drop down menu
import ConnectWalletButton from "./ConnectWalletButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const WithoutAuth = ({ userLogOut }) => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    // e.preventDefault();

    try {
      const API_BASE_URL =
        process.env.NODE_ENV === "development"
          ? "http://localhost:5002"
          : "https://sjq6s9ict5.execute-api.eu-north-1.amazonaws.com/dev";

      const apiUrl = `${API_BASE_URL}/api/users/logout`;

      const logoutReq = await axios.post(
        `${apiUrl}`,
        {},
        {
          withCredentials: true, // Ensure cookies are included in the request
        }
      );

      console.log(logoutReq.data);
      if (logoutReq.status == 200) {
        alert("You are successfully logged out");
        sessionStorage.removeItem("email");
        userLogOut();
      }
    } catch (error) {
      console.log("An internal servere error happned", error);
    }
  };

  const handleProPlayerClick = () => {
    navigate("/cv-home");
  };

  // localStorage.removeItem('token');

  const [isItemsVisible, setItemsVisible] = useState(false);
  const toggleItems = () => {
    setItemsVisible((prevState) => !prevState);
  };
  return (
    <>
      <div className="dropdownmenu">
        <button onClick={toggleItems} className="dropdown">
          {" "}
          <img
            className="nav_user_logo"
            src={default_user_logo}
            alt="userLogo"
          />
        </button>
        {isItemsVisible ? (
          <>
            {" "}
            <ul className="dropdu">
              <li className="dropwallet">
                {" "}
                <ConnectWalletButton />
              </li>
              <li className="dropitms" onClick={() => handleProPlayerClick()}>
                Pro Player
              </li>
              <Link className="dropitms" to="/userdash">
                Userdashbord
              </Link>
              <li className="dropitms" onClick={() => handleLogout()}>
                Logout
              </li>
            </ul>
          </>
        ) : null}
      </div>
    </>
  );
};

export default WithoutAuth;
