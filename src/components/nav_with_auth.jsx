import React from "react";
import { Button } from "@/components/ui/button";

const WithAuth = ({ handleLoginClick, handleSignUpClick }) => {
  return (
    <>
      <Button
        variant="outline"
        className="bg-transparent hover:bg-blue-400 text-white border-white hover:border-transparent mx-2 my-1"
        onClick={() => handleLoginClick()}
      >
        Login
      </Button>
      <Button
        variant="default"
        className="bg-white hover:bg-blue-100 text-blue-500 mx-2 my-1"
        onClick={() => handleSignUpClick()}
      >
        Sign Up
      </Button>
    </>
  );
};

export default WithAuth;
