import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaGamepad,
  FaPaperPlane,
  FaCog,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [botPosition, setBotPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setBotPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;
    const userMessage = { name: "User", message: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await axios.post(
        "http://localhost:5000/chatbot/predict",
        {
          message: input,
        }
      );
      const botMessage = {
        name: "GameBot",
        message: response.data.answer,
      };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbox" style={{ fontFamily: '"Orbitron", sans-serif' }}>
      <div
        className={`chatbox__support ${isOpen ? "chatbox--active" : ""}`}
        style={{
          position: "fixed",
          bottom: "80px",
          right: "20px",
          width: "350px",
          height: "500px",
          backgroundColor: "#000000",
          border: "3px solid #00FFFF",
          borderRadius: "15px",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          className="chatbox__header"
          style={{
            background: "linear-gradient(180deg, #000000, #001F3F)",
            color: "#00FFFF",
            padding: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #00FFFF",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaGamepad style={{ marginRight: "10px", fontSize: "24px" }} />
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              GameBot 3000
            </span>
          </div>
          <div>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                background: "none",
                border: "none",
                color: "#00FFFF",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#00FFFF",
                cursor: "pointer",
              }}
            >
              <FaCog />
            </button>
          </div>
        </div>
        <div
          className="chatbox__messages"
          style={{
            height: "350px",
            overflowY: "auto",
            padding: "15px",
            backgroundImage: `radial-gradient(#00FFFF 1px, transparent 1px), radial-gradient(#00FFFF 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 10px 10px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${botPosition.x}%`,
              top: `${botPosition.y}%`,
              width: "40px",
              height: "40px",
              backgroundColor: "#00FFFF",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 10px #00FFFF",
              transition: "all 2s ease-in-out",
            }}
          >
            <FaGamepad style={{ color: "#000000" }} />
          </div>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                maxWidth: "80%",
                padding: "10px",
                borderRadius: "12px",
                marginBottom: "10px",
                fontSize: "14px",
                lineHeight: "1.4",
                backgroundColor: msg.name === "User" ? "#003366" : "#00FFFF",
                color: msg.name === "User" ? "#FFFFFF" : "#000000",
                boxShadow: "0 2px 5px rgba(0,255,255,0.2)",
                alignSelf: msg.name === "User" ? "flex-end" : "flex-start",
                marginLeft: msg.name === "User" ? "auto" : "0",
                marginRight: msg.name === "User" ? "0" : "auto",
                position: "relative",
                zIndex: 10,
              }}
            >
              {msg.message}
            </div>
          ))}
        </div>
        <div
          className="chatbox__footer"
          style={{
            padding: "12px",
            backgroundColor: "#001F3F",
            borderTop: "2px solid #00FFFF",
          }}
        >
          <div style={{ display: "flex" }}>
            <input
              type="text"
              placeholder="Enter command..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={handleKeyUp}
              style={{
                flexGrow: 1,
                padding: "10px",
                border: "2px solid #00FFFF",
                borderRadius: "20px",
                backgroundColor: "#000000",
                color: "#00FFFF",
                marginRight: "10px",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                backgroundColor: "#00FFFF",
                color: "#000000",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.3s",
              }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
      <div
        className="chatbox__button"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        <button
          onClick={toggleChatbox}
          style={{
            backgroundColor: "#00FFFF",
            color: "#000000",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
            transition: "transform 0.3s",
          }}
        >
          <FaGamepad />
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
