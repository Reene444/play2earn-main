import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Earn.css";
import Header from "./header";
import Footer from "./footer";

const TaskCard = ({ task, onSelect }) => {
  //console.log("TaskCard Task:", task); // Log task details to verify
  return (
    <div className="task-card" onClick={() => onSelect(task)}>
      <div className="task-card-content">
        <img
          src={task.logo}
          alt={`${task.category} logo`}
          className="task-logo"
        />
        <h3>{task.category}</h3>
        <p>{task.description}</p>
        <div className="task-card-footer">
          <span className="task-difficulty">{task.difficulty}</span>
          <span className="task-reward">{task.reward} pts</span>
        </div>
      </div>
    </div>
  );
};

// TaskModal Component
const TaskModal = ({ task, onClose, onAccept }) => {
  const [agreed, setAgreed] = useState(
    () => localStorage.getItem("agreed") === "true"
  );

  const handleCheckboxChange = () => {
    const newAgreed = !agreed;
    setAgreed(newAgreed);
    localStorage.setItem("agreed", newAgreed);
  };

  if (!task) return null;

  // Define category-specific instructions
  const getInstructions = (category) => {
    switch (category) {
      case "Survey":
        return [
          "Answer all survey questions honestly.",
          "Provide detailed feedback where possible.",
          "Complete the survey within the given time limit.",
        ];
      case "Audio Transcription":
        return [
          "Listen to the audio recording carefully.",
          "Transcribe the audio into text accurately.",
          "Ensure proper punctuation and formatting.",
        ];
      case "Follow Task":
        return [
          "Follow the specific instructions provided.",
          "Complete each step as described.",
          "Double-check for any missed steps before submission.",
        ];
      case "Text tagging":
        return [
          "Read through the provided text.",
          "Tag each relevant section as per the guidelines.",
          "Ensure all tags are correctly applied.",
        ];
      case "Image Captcha Task":
        return [
          "Identify and solve the captcha challenges.",
          "Ensure accuracy in solving each captcha.",
          "Complete all captcha tasks provided.",
        ];
      case "Image Caption":
        return [
          "Review the provided images.",
          "Write descriptive captions for each image.",
          "Ensure captions are clear and relevant.",
        ];
      case "Translation Challenge":
        return [
          "Translate the given text between the specified languages.",
          "Maintain the original meaning and tone of the text.",
          "Proofread your translation for accuracy.",
        ];
      case "Wordify":
        return [
          "Convert the provided text into engaging visual formats.",
          "Use creative and clear designs.",
          "Ensure the final output is visually appealing.",
        ];
      default:
        return [
          "Follow the general instructions provided.",
          "Complete the task to the best of your ability.",
          "Review your work before submission.",
        ];
    }
  };

  const instructionsArray = getInstructions(task.category);

  return (
    <div className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="modal-content relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
        <button
          onClick={onClose}
          className="close-button absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
          aria-label="Close Modal"
        >
          &times;
        </button>
        <div className="modal-header flex items-center space-x-4 mb-4">
          <img
            src={task.logo}
            alt={`${task.category} logo`}
            className="modal-logo w-12 h-12 rounded-full border border-gray-300"
          />
          <h2 className="text-2xl font-semibold text-gray-800">
            {task.category}
          </h2>
        </div>
        <div className="modal-body">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {task.description}
          </h3>
          <div className="task-details flex items-center justify-between text-gray-600 mb-4">
            <span className="task-difficulty text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
              {task.difficulty}
            </span>
            <span className="task-reward text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
              {task.reward} pts
            </span>
          </div>
          <div className="instructions mb-6">
            <h4 className="text-base font-semibold text-gray-800 mb-2">
              Instructions:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              {instructionsArray.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          <div className="terms flex items-center space-x-2 mb-6">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="terms-link text-blue-500 hover:underline"
              >
                terms and services
              </a>
            </label>
          </div>
          <button
            onClick={() => onAccept(task)}
            className={`accept-button w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
              agreed
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!agreed}
          >
            Accept Task
          </button>
        </div>
      </div>
    </div>
  );
};

// Earn Component
const Earn = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const API_BASE_URL =
          process.env.NODE_ENV === "development"
            ? "http://localhost:5002"
            : "https://sjq6s9ict5.execute-api.eu-north-1.amazonaws.com/dev";

        const apiUrl = `${API_BASE_URL}/api/tasks`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const data = await response.json();
        setTasks(
          data.map((task) => ({
            ...task,
            id: task._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again later.");
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const searchLower = searchTerm.toLowerCase().trim();
    const filtered = tasks.filter(
      (task) =>
        task.category &&
        (selectedCategory === "All" || task.category === selectedCategory) &&
        task.category.toLowerCase().includes(searchLower)
    );
    //console.log("Filtered Tasks:", filtered); // Log filtered tasks to verify
    setFilteredTasks(filtered);
  }, [tasks, selectedCategory, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    console.log("Selected Category:", category); // Log the selected category
  };

  const handleTaskAccept = (task) => {
    // Check the category of the task and navigate accordingly
    switch (task.category) {
      case "Survey":
        navigate("/survey");
        break;
      case "Wordify":
        navigate("/Wordify");
        break;
      case "Wizard":
        navigate("/wizard");
        break;
      case "Follow Task":
        navigate("/FollowTask");
        break;
      case "Audio Transcription":
        navigate("/AudioTranscription");
        break;
      case "Translation Challenge":
        navigate("/translation");
        break;
      case "Image Caption":
        navigate("/imagecaption");
        break;
      case "Image Captcha Task":
        navigate("/captcha");
        break;
      case "Text tagging":
        navigate("/texttagging");
        break;
      case "Search & Win":
        navigate("/searchandcapture");
        break;
      default:
        console.error("Unknown task category:", task.category);
        navigate("/default"); // Optional fallback route
        break;
    }

    // Reset selected task after navigation
    setSelectedTask(null);
  };

  const categories = [
    "All",
    "Survey",
    "Audio Transcription",
    "Follow Task",
    "Text tagging",
    "Image Captcha ",
    "Image Caption",
    "Translation Challenge",
    "Wizard",
    "Wordify",
  ];

  return (
    <>
      <Header />
      <div className="earn-container">
        <h1>Games Marketplace</h1>
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
            aria-label="Search tasks"
          />
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
                aria-label={`Filter by ${category}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="task-grid">
            {filteredTasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSelect={setSelectedTask}
                />
              ))
            )}
          </div>
        )}
        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onAccept={handleTaskAccept}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Earn;
