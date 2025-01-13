import React, { useContext } from "react";
import { Link } from "react-router-dom";
import WithAuth from "./nav_with_auth";
import WithoutAuth from "./nav_without_auth";
import LoginPopup from "./Login";
import SignUpPopup from "./Signup";
import ForgetPassPopup from "./Forgetpassword";
import PasswordReset from "./PassReset";
// import Leaderboard from "./leaderboard";
import { useState } from "react";
import { AuthContext } from "./globalStateForAuth";

const Header = () => {
  // (authentication_system by mit prajapati)
  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
  const [isSignUpPopupOpen, setSignUpPopupOpen] = useState(false);
  const [isForgetPasswordOpen, setForgetPasswordOpen] = useState(false);
  const [isPassResetOpen, setPassResetOpen] = useState(false);
  const { userLoginStatus, setUserLoginStatus } = useContext(AuthContext);
  // (user dropdown menu by mit prajapati)
  const [isDropdownMenu, setDropdownMenu] = useState(false);

  const handleLoginClick = () => {
    setLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setLoginPopupOpen(false);
  };

  const innSignUpLink = () => {
    setSignUpPopupOpen(true);
    setLoginPopupOpen(false);
  };

  const closeSignUpPopup = () => {
    setSignUpPopupOpen(false);
  };

  const handleSignUpClick = () => {
    setSignUpPopupOpen(true);
  };

  const innLogInlink = () => {
    setSignUpPopupOpen(false);
    setLoginPopupOpen(true);
  };

  const innForgetPasswordLink = () => {
    setLoginPopupOpen(false);
    setForgetPasswordOpen(true);
  };

  const closeForgetPasswordLink = () => {
    setForgetPasswordOpen(false);
  };

  const innResetPasswordLink = () => {
    setForgetPasswordOpen(false);
    setPassResetOpen(true);
  };

  const closeResetPasswordLink = () => {
    setPassResetOpen(false);
  };

  const userLoginStatusDone = () => {
    // setUserLoginStatus(true)
    setUserLoginStatus(true);
  };

  const userLogOut = () => {
    setUserLoginStatus(false);
  };

  const dropdownMenuLink = () => {
    setDropdownMenu(true);
    // console.log("the dropdown open")
  };

  const closDropdownMenuLink = () => {
    setDropdownMenu(false);
    // console.log("the dropdown close")
  };

  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-b from-blue-500 to-blue-300 text-white p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src="assets/logo.png"
              alt="Play2Earn Logo"
              className="h-12 w-12 md:h-16 md:w-16 mr-2"
            />
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end items-center">
            <Link to="/" className="text-white hover:text-blue-200 mx-2 my-1">
              Home
            </Link>
            <Link
              to="/earn"
              className="text-white hover:text-blue-200 mx-2 my-1"
            >
              Games
            </Link>
            <Link
              to="/leaderboard"
              className="text-white hover:text-blue-200 mx-2 my-1"
            >
              Leaderboard
            </Link>
            <Link
              to="/referrals"
              className="text-white hover:text-blue-200 mx-2 my-1"
            >
              Referrals
            </Link>

            {userLoginStatus ? (
              <WithoutAuth
                userLogOut={userLogOut}
                dropdownMenuOpen={dropdownMenuLink}
                closeDropdownMenu={closDropdownMenuLink}
              />
            ) : (
              <WithAuth
                handleLoginClick={handleLoginClick}
                handleSignUpClick={handleSignUpClick}
              />
            )}
          </nav>
        </div>
      </header>

      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={closeLoginPopup}
        innSignUpLink={innSignUpLink}
        innForgetPasswordLink={innForgetPasswordLink}
        userLoginStatusDone={userLoginStatusDone}
      />
      <SignUpPopup
        isOpen={isSignUpPopupOpen}
        onClose={closeSignUpPopup}
        innLogInlink={innLogInlink}
      />
      <ForgetPassPopup
        isOpen={isForgetPasswordOpen}
        onClose={closeForgetPasswordLink}
        innResetPasswordLink={innResetPasswordLink}
      />
      <PasswordReset
        isOpen={isPassResetOpen}
        onClose={closeResetPasswordLink}
      />
    </>
  );
};

export default Header;
