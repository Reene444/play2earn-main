import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed

const ConnectWalletButton = () => {
  const [walletAddress, setWalletAddress] = useState(""); // State to store the wallet address
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(true);

  const connectWallet = async () => {
    if (window.ethereum) {
      setLoading(true); // Set loading to true when starting connection
      setError(null); // Clear any previous errors
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const userAddress = accounts[0];
        setWalletAddress(userAddress);

        // Send the wallet address to the backend

        const API_BASE_URL =
          process.env.NODE_ENV === "development"
            ? "http://localhost:5002"
            : "https://sjq6s9ict5.execute-api.eu-north-1.amazonaws.com/dev";

        const apiUrl = `${API_BASE_URL}`;

        const response = await axios.post(`${apiUrl}/api/receive-address`, {
          address: userAddress,
        });
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        setError("Failed to connect wallet. Please try again.");
      } finally {
        setLoading(false); // Reset loading state after operation
      }
    } else {
      // Redirect to MetaMask download page in a new tab
      window.open("https://metamask.io/download.html", "_blank");
    }
  };

  useEffect(() => {
    // Check if MetaMask is available
    if (typeof window.ethereum === "undefined") {
      setIsMetaMaskAvailable(false);
    }

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        const newAddress = accounts[0];
        setWalletAddress(newAddress);

        try {
          // Send the new wallet address to the backend
          const response = await axios.post(
            "http://localhost:5002/api/receive-address",
            { address: newAddress }
          );
          console.log("Address updated:", response.data);
        } catch (error) {
          console.log("Error sending updated address...", error);
        }
      } else {
        setWalletAddress("");
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return (
    <div className="flex items-center">
      <button
        onClick={connectWallet}
        className="bg-white hover:bg-blue-100 text-blue-500 mx-2 my-1 p-2 rounded border border-blue-500 transition duration-300"
        disabled={loading}
      >
        {loading
          ? "Connecting..."
          : walletAddress
          ? `Address: ${walletAddress.slice(0, 5)}...${walletAddress.slice(-5)}`
          : "Connect Wallet"}
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}{" "}
        {/* Display error message */}
      </button>
      <div className="flex items-center ml-4">
        <div
          className={`w-3 h-3 rounded-full ${
            walletAddress ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="ml-2 text-sm">
          {walletAddress ? "Connected" : "Not Connected"}
        </span>
      </div>
    </div>
  );
};

export default ConnectWalletButton;
